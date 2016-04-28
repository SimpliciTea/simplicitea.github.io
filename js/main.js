jQuery(document).ready(function($) {

	
	/* 
	 *  Etchasketch 
	 */

	var drawGrid = function () {
		//clears any previous divs
		$('#sketch-wrap').empty();

		//sets vars for grid size 
		var gridSize = $('#gridSize').val();
		var cellSize = 400 / gridSize;

		//make 16 rows of divs
		for (i=0; i<gridSize; i++) { 
			$('#sketch-wrap').append('<div class="row"></div>');
		}
		
		//populate each row with 16 cells
		$('#sketch-wrap>div').each(function() {
			for (i=0;i<gridSize;i++) { 
				$(this).append('<div class="cell"></div>')
			}
		})

		//set height, width and opacity of grid cells and rows
		$('.row').each(function() {
			$(this).height(cellSize) });
		$('.cell').each(function() {
			$(this).height(cellSize);
			$(this).width(cellSize);
			$(this).css('opacity', '0');
		})

		//creates color trail from mouse
		$('#sketch-wrap>div>div').mouseenter(function() {
			if ($(this).css('opacity') < 1) { 
				$(this).css('opacity', '+=.2');
			}
		})
	}
	
	drawGrid();
	
	// event handlers
	$('#newGrid').click(drawGrid);
	$("#gridSize").keyup(function (e) {
    	if (e.keyCode == 13) {
        	$("#newGrid").click();
    	}
	});



	/*
	 *  ScrollToTop functionality
	 */

	var toTopShown = false;

	$(document).scroll(function() {
		var y = $(this).scrollTop();

		if (y < 440 && !toTopShown) {
			$('#toTop').slideUp();
			toTopShown = true;
		}

		if (y > 440 && toTopShown) {
			$('#toTop').slideDown();
			toTopShown = false;
		}
	});
})