 $(document).ready(function(){
    


    $('.chips').material_chip();
    $('.chips > input').addClass('white-text');

    $('#retract-arrow').click(function() {
		retractCarousel();

    });


	


	var testTree = `Register for TSA Prescreening
	What is a TSA Pre Check?
		What does pre check mean?
		What is a redress number?
			What is a redress number on a passport?
			What does redress mean for airlines?
		Can family members use TSA Pre?
		What is a federal TSA agent?
			Who owns the TSA?
			How much does a TSA agent make a year?
			What does a TSA agent do?
		Do kids need TSA PreCheck?
		What is a TSA screening?
		What do I need to get TSA PreCheck?
		How long is pre check good for?
	How do I sign up for TSA PreCheck?
		How do I get my known traveler number?
		How do I add my KTN to United?
		How much does it cost to get TSA approved?
		What is a Passid number?
		What is your maternal name?
	How do I get a global entry card?
		What countries does Global Entry Work?
		What is my Known Traveler Number global entry?
		How long does it take for a global entry application to be approved?
		What are the benefits of global access?
		Do you need your Global Entry card?
		How much does it cost for Global Entry?
	What is a global entry card?
		Is global entry the same as TSA PreCheck?
		Can I use my Global entry card for TSA PreCheck?
		Is a redress number the same as Global Entry?
		Is global entry the same as Nexus?
		What airports have global entry?
	What is security at an airport?
		How much is clear airport security?
		Which airlines participate in TSA PreCheck?`;

	$('#side-menu').hide();
	$('#main-body').toggleClass('col');

	testTree = createTree(testTree);
	displayPath(getPath(testTree));
	getResults(testTree);
	createTopNav(testTree);
	createSidenav(testTree, $('.sidenav'), 0, 0);
	$('.collapsible').collapsible({
	    accordion: false, // A setting that changes the collapsible behavior to expandable instead of the default accordion style
	    onOpen: function(el) { el.find('.rotate').first().toggleClass("down") }, // Callback for Collapsible open
	    onClose: function(el) { el.find('.rotate').first().toggleClass("down") } // Callback for Collapsible close
	});

	$('.collapsible-header').click(function() {
		var node = jQuery.data(this, 'node');
		var path = getPath(node);
		displayPath(path);
		getResults(node);
	});

	$('.top-level-card').click(function() {
		var node = jQuery.data(this, 'node');
		var path = getPath(node);
		displayPath(path);
		getResults(node);
		var idNumber = this.id;
		idNumber = parseInt(idNumber.replace('top-level', ''));
		$('#top-collapsible').collapsible('open', idNumber);
		$('#top-collapsible').children('.active').find('.rotate').first().toggleClass("down");
		$('#top-collapsible').children(':not(.active)').find('.rotate').removeClass("down");
		
		retractCarousel();
		$('#main-body').toggleClass('col')
		$('#side-menu').animate({width: 'show'});
	});

	



	$('#main-body').on('DOMSubtreeModified', function() {
		if($('#main-body').height() > $('#side-menu').height()) {
			$('#side-menu').height($('#main-body').height());
		}
	});



	$('#main-page').on('click', '.not-saved', function() {

		if (localStorage.saved) {
			var obj = JSON.parse(localStorage.saved);
			obj.data.push($(this).parent().html());
			obj.path.push($('.path-display').html());
			obj.id.push(this.classList[0]);
			localStorage.saved = JSON.stringify(obj);
		} else {
			localStorage.saved = JSON.stringify({
				"data": [$(this).parent().html()],
				"path": [$('.path-display').html()],
				"id": [this.classList[0]],
			});
		}

		$(this).children('i').removeClass('black-text');
		$(this).children('i').addClass('blue-text');
		$(this).children('i').attr('data-tooltip', 'Link Saved!');
		$('.tooltipped').tooltip({delay: 20});
		$(this).toggleClass('not-saved');
		$(this).toggleClass('saved');
	});


	$('#main-page').on('click', '.saved', function() {
		if (localStorage.saved) {
			var obj = JSON.parse(localStorage.saved);
			var id = this.classList[0];
			console.log(id);
			var index = obj.id.findIndex(function(element, index, array) {
				if (id == element) {
					return true;
				} else {
					return false;
				}
			});
			if (index >= 0) {
				obj.id.splice(index, 1);
				obj.data.splice(index, 1);
				obj.path.splice(index, 1);
				localStorage.saved = JSON.stringify(obj);
			}
		}


		$(this).children('i').removeClass('blue-text');
		$(this).children('i').addClass('black-text');
		$(this).children('i').attr('data-tooltip', 'Save this link');
		$('.tooltipped').tooltip({delay: 20});
		$(this).toggleClass('not-saved');
		$(this).toggleClass('saved');
	});



	$('#bookmarks').click(function() {
		$('body').empty();
		if (localStorage.saved) {
			var obj = JSON.parse(localStorage.saved);
			for (var i = 0; i < obj.data.length; i++) {
				$('body').append(obj.data);
			}
		}
	});


});

// creates carousel with the first level of the tree
function createTopNav(tree) {
	for (var i = 0; i < tree.children.length; i++) {
		var tmp = '<div class="card-panel hoverable top-level-card" id="top-level' + i + '">';
		tmp += '<div class="valign-wrapper black-text">'
		tmp += '<i class="fa fa-info-circle" aria-hidden="true"></i>'
		tmp += '<h6>';
		tmp += tree.children[i].title;
		tmp += '</h6></div></div>';
		$('.slick-slider').append(tmp);
		jQuery.data($('#top-level' + i)[0], 'node', tree.children[i]);
	}


	$('.slick-slider').slick({
    	adaptiveHeight: true,
    	arrows: true,
    	autoplay: false,
    	slidesToShow: 4,
    	infinite: true,
    	prevArrow: $('#left-arrow'),
		nextArrow: $('#right-arrow'),
		responsive: [
		    {
		      breakpoint: 1024,
		      settings: {
		        slidesToShow: 3,
		        infinite: true,
		      }
		    },
		    {
		      breakpoint: 600,
		      settings: {
		        slidesToShow: 2,
		      }
		    },
		    {
		      breakpoint: 480,
		      settings: {
		        slidesToShow: 1,
		      }
		    }
		],
    });

}

// recursive helper function that populates the given div with collapsible menus and submenus
// currDiv must be a jquery element
// index is an integer used for IDs in recursive calls, on first call use 0
// secondIndex is also an integer for IDs
// index is depth of recursion and secondIndex is number of recursive call
function createSidenav(tree, currDiv, index, secondIndex) {
	if (!hasChildren(tree)) {
		return
	}
	var list;
	if (index == 0 && secondIndex == 0) {
		list = '<ul class="collapsible sidenav-list fa-ul" id="top-collapsible" data-collapsible="accordion">';
	} else {
		list = '<ul class="collapsible sidenav-list fa-ul" data-collapsible="accordion">';
	}

	for (var i = 0; i < tree.children.length; i++) {
		list += '<li>';
		list += '<div class="collapsible-header" id="sidenav-collapsible-head' + index + '-' + secondIndex + '-' + i + '">';
		if (hasChildren(tree.children[i])) {
			list += '<i class="fa-li fa fa-caret-right rotate" aria-hidden="true"></i>';
			list += tree.children[i].title;
			list += '</div>';
			list += '<div class="collapsible-body" id="sidenav-collapsible-body' + index + '-' + secondIndex + '-' + i + '">';
			list += '</div>'
		} else {
			list += '<i class="fa-li fa fa-minus" aria-hidden="true"></i>';
			list += tree.children[i].title;
			list += '</div>';
		}
		list += '</li>';

	}
	list += '</ul>';

	currDiv.append(list);

	// populate the children
	for (var i = 0; i < tree.children.length; i++) {
		jQuery.data($('#sidenav-collapsible-head' + index + '-' + secondIndex + '-' + i)[0], "node", tree.children[i]);
		if (hasChildren(tree.children[i])) {
			createSidenav(tree.children[i], $('#sidenav-collapsible-body' + index + '-' + secondIndex + '-' + i), index + 1, i);
		}
	}
}


// takes a path array and displays the path to the current node
function displayPath(path) {
	$('.path-display').empty();
	for (var i = 0; i < path.length; i++) {
		var tmp = '<a href="#!" class="breadcrumb white-text" id="path-node' + i + '">';
		tmp += path[i].title;
		tmp += '</a>';
		$('.path-display').append(tmp);
		jQuery.data($('#path-node' + i)[0], 'node', path[i]);
	}
	$('.breadcrumb').click(function() {
		var node = jQuery.data(this, 'node');
		var path = getPath(node);
		displayPath(path);
		getResults(node);
	});
}



// pass it a node, returns ordered array which represents path from root of tree to the node
function getPath(node) {
	var path = [];
	currNode = node;
	path.unshift(currNode);
	while (currNode.parent != null) {
		currNode = currNode.parent;
		path.unshift(currNode);
	}
	return path;
}


// search and display results for a given node
function getResults(node) {
	getBingResults(node.title, displayResults);
}

// Tree data structure
function Node(title, body) {
	this.title = title;
    this.body = body;
    this.parent = null;
    this.children = [];
}


function addChild(parent, child) {
    parent.children.push(child);
    child.parent = parent;
}

function hasChildren(node) {
	if (node.children.length > 0) {
		return true;
	} else {
		return false;
	}
}



// functions to build a tree from a string representing the tree in tabbed hierarchy



function createTree(text) {
	var treeLevels = [];
	var levelTracker = [];
	var lines = text.split('\n');
	for (var i = 0; i < lines.length; i++) {
		levelTracker[getTabCount(lines[i])] = -1;
		treeLevels[getTabCount(lines[i])] = [];
	}
	var rootNode = new Node(lines[0], '');
	levelTracker[0] = 0;
	treeLevels[0].push(rootNode);
	for (var i = 1; i < lines.length; i++) {
		var currLine = lines[i];
		var currTab = getTabCount(currLine);
		var currNode = new Node(currLine, '');
		treeLevels[currTab].push(currNode);
		levelTracker[currTab]++;
		if (currTab > 0) {
			addChild(treeLevels[currTab - 1][levelTracker[currTab - 1]], currNode);
		}
	}
	return rootNode;
}

// gets number of initial tabs
function getTabCount(str) {
	for (var i = 0; i < str.length; i++) {
		if (str.charAt(i) != '\t') {
			return i;
		}
	}
}



function displayResults(data, panelId) {
	var tmp = '';
	tmp += '<ul>';
	var results = data.webPages.value;
	for (var i = 0; i < results.length; i++) {
		tmp += '<li class="search-result">';
		tmp += `<div class="aaa` + results[i].displayUrl +  ` save not-saved right ">
					
						<i class="fa fa-floppy-o fa-2x tooltipped" data-position="left" data-delay="30" data-tooltip="Save this link" aria-hidden="true"></i>
					
				</div>`
		tmp += '<a href="' + results[i].url + '" class="search-result-title blue-text" target="_blank">';
		tmp += results[i].name;
		tmp += '</a>';
		tmp += '<div class="search-result-link green-text text-darken-3">';
		tmp += results[i].displayUrl;
		tmp += '</div>';
		tmp += '<div class="search-result-description">';
		tmp += results[i].snippet;
		tmp += '</div>';
		tmp += '</li>';
	} 

	tmp += '</ul>';
	$('.result-display').empty();
	$('.result-display').append(tmp);
	$('.tooltipped').tooltip({delay: 20});

	if (localStorage.saved) {
		var obj = JSON.parse(localStorage.saved);
		var ids = obj.id;
		for (var i = 0; i < ids.length; i++) {
			var tmp = '.' + $.escapeSelector(ids[i]);	
			$(tmp).removeClass('saved not-saved')
			$(tmp).addClass('saved');
			$(tmp).children('i').removeClass('black-text');
			$(tmp).children('i').addClass('blue-text');
			$(tmp).children('i').attr('data-tooltip', 'Link Saved!');
			$('.tooltipped').tooltip({delay: 20});
		}
	}

	
}


function getBingResults(searchQuery, callback) {
	
	$.get('/main/search/', {search_query: searchQuery})
	.done(function(data) {
		callback(data);
	});
}


function retractCarousel() {
	$('#carousel').slideToggle('fast');
	$('#retract-arrow').toggleClass('down');
}