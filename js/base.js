$(document).ready(function(){

	// budget
	$('.budget').each(function(){
		var par = $(this),
			tr = $('TBODY TR', this),
			sum = parseInt($('TR.sum TD+TD', this).text().replace(/\s+/g, ''), 10),
			curr = $('.curr SPAN', this),
			bars_in_wrap = $('.bars__in'),
			bars_out_wrap = $('.bars__out');
			
		tr.each(function(){
			var lev = parseInt(this.className.substring(3), 10);
			$(this).data('lev', lev);
		});


		$('TD+TD', tr).each(function(){
			var val = parseInt($(this).text().replace(/\s+/g, '').replace(',','.').replace(/–/g, '-'), 10);
			
			if (isNumber(val)) {
				$(this).text((val / 1000000).toMoney(2, '.', ' '));
				$(this).data('val', val)
				if (sum) {
					$('<td>'+nicePercent(100*val/sum)+'%</td>').insertAfter($(this));
				}
			}
		});
		

		tr.each(function(){
			var curlev = $(this).data('lev'),
				isnext = $(this).nextAll().length,
				nextlev = $(this).next().data('lev');

			if (curlev > 1) {
				$(this).hide();
			}
			
			if (curlev == 0) {

				if (par.hasClass('budget_in')) {
					$(this).hover(function(){
						$(this).nextUntil('.lev00').filter('.lev01').trigger('mouseover');
					}, function(){
						$('> li', bars_in_wrap).removeClass('show');
					});
				}

				if (par.hasClass('budget_out')) {
					$(this).hover(function(){
						$(this).nextUntil('.lev00').filter('.lev01').trigger('mouseover');
					}, function(){
						$('> li', bars_out_wrap).removeClass('show');
					});
				}
			}


			if (curlev == 1) {
				$(this).click(function(){
					$(this).nextUntil('.lev01, .lev00').toggle();
				});

				if (nextlev == 2) {
					$('TD:eq(0)', this).wrapInner('<span class="link-js">');
				}
				
				if (par.hasClass('budget_in') && !$(this).hasClass('sum') && !$(this).prevAll('.sum').length) {
					t = $('<li style="width:'+ $('TD:eq(2)', this).text() +'" title="' +$('TD:eq(0)', this).text()+ '"><ul></ul></li>').appendTo(bars_in_wrap);

					$(this).hover(function(){
						$('> li', bars_in_wrap).eq($(this).prevAll().filter('.lev01').length).addClass('show');
					}, function(){
						$('> li', bars_in_wrap).removeClass('show');
					});
				}

				if (par.hasClass('budget_out') && !$(this).hasClass('sum') && !$(this).prevAll('.sum').length) {
					t = $('<li style="width:'+ $('TD:eq(2)', this).text() +'" title="' +$('TD:eq(0)', this).text()+ '"><ul></ul></li>').appendTo(bars_out_wrap);

					$(this).hover(function(){
						$('> li', bars_out_wrap).eq($(this).prevAll().filter('.lev01').length).addClass('show');
					}, function(){
						$('> li', bars_out_wrap).removeClass('show');
					});
				}

			}
			
			
			if (curlev == 2) {
				if (par.hasClass('budget_in') && !$(this).prevAll('.sum').length) {
					var curbar = $(this).prevAll('.lev01').length - 1,
						targ = $('> li', bars_in_wrap).eq(curbar).find('ul');
					
					$('<li style="width:'+ $('TD:eq(2)', this).text() +'" title="' +$('TD:eq(0)', this).text()+ '">').appendTo(targ);

					$(this).hover(function(){
						$('> li', targ).eq($(this).prevUntil('.lev01').filter('.lev02').length).addClass('show');
					}, function(){
						$('li', bars_in_wrap).removeClass('show');
					});

				}

				if (par.hasClass('budget_out') && !$(this).prevAll('.sum').length) {
					var curbar = $(this).prevAll('.lev01').length - 1,
						targ = $('> li', bars_out_wrap).eq(curbar).find('ul');

					$('<li style="width:'+ $('TD:eq(2)', this).text() +'" title="' +$('TD:eq(0)', this).text()+ '">').appendTo(targ);

					$(this).hover(function(){
						$('> li', targ).eq($(this).prevUntil('.lev01').filter('.lev02').length).addClass('show');
					}, function(){
						$('li', bars_out_wrap).removeClass('show');
					});

				}
			}


		});

		
		curr.click(function(){
			curr.removeClass('cur');
			$(this).addClass('cur');
			
			var course = $(this).data('curr');

			$('TD+TD', tr).each(function(){
				var val = $(this).data('val');
				if (isNumber(val)) {
					$(this).text((val / 1000000 / course).toMoney(2, '.', ' '));
				}
			});
			
		});
		
		
	});
	
}); // dom ready


function nicePercent(n) {
	var res = 0,
		digits = 1;

	while (res == 0) {
		res = n.toFixed(digits);
		digits++;
	}
	return n.toFixed(digits);
}

Number.prototype.toMoney = function(decimals, decimal_sep, thousands_sep){ 
   var n = this,
	   c = isNaN(decimals) ? 2 : Math.abs(decimals),
	   d = decimal_sep || '.',
	   t = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
	   sign = (n < 0) ? '-' : '',
	   i = parseInt(n = Math.abs(n).toFixed(c)) + '', 
	   j = ((j = i.length) > 3) ? j % 3 : 0;
	   
   return sign + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : ''); 
}

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}