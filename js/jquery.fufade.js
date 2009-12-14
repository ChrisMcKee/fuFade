/* =========================================================
// jquery.fufade.js 1.0
// Chris McKee <pcdevils@gmail.com> 2008-9
// chrismckee.co.uk // http://bit.ly/chrisisagit
// re-coded & optimized for size + functionality
// Based on innerfade - see git for details
// ========================================================= */
/*
 * Default Settings
 * | Name            |  Default  | Type                 |
 * | type            | sequence  | sequence or random   |
 * | timeout         | 2 seconds | Microseconds (2000=2)|
 * | containerheight | auto      | Pixels               |
 * | runningclass    | fufade    | class name           |
 * | children        | definer   | null                 |
 * |____________________________________________________|
 */

(function ($) {
    var settings, elements, i, current, last, prev, next, fuTimer;
    
    //Main
    $.fn.fuFade = function (options) {
        return this.each(function () {   
              $.fuFade(this, options);
        });
    };
    
    $.fuFade = function (container, options) {
        settings = {
            'speed':          'normal',
            'type':           'sequence',
            'timeout':        2000,
            'containerheight':  'auto',
            'runningclass':     'fufade',
            'children':         null
        };

        if (options){ $.extend(settings, options); }

        elements = (settings.children === null) ? $(container).children() : elements = $(container).children(settings.children);
        
        if (elements.length > 1) {
            $(container).css('position', 'relative').css('height', settings.containerheight).addClass(settings.runningclass);
            
            for (i = 0; i < elements.length; i++) {
                $(elements[i]).css('z-index', String(elements.length-i)).css('position', 'absolute').hide();
            }
            
						$(".nextbtn").bind('click',function (){
								fuTimer =	setTimeout(function () {
                    $.fuFade.next(elements, settings, 1, 0, fuTimer);
                }, 0);																			
						});
						//wake up back button
						$(".backbtn").fadeTo("fast", 0.5);
            
            if (settings.type === "sequence") {
                setTimeout(function () {
                    $.fuFade.next(elements, settings, 1, 0);
                }, settings.timeout);
                $(elements[0]).show();
            } else if (settings.type === "random") {
            		last = Math.floor ( Math.random () * ( elements.length ) );
                setTimeout(function () {
                    do { 
												current = Math.floor ( Math.random ( ) * ( elements.length ) );
										} while (last === current );             
										$.fuFade.next(elements, settings, current, last);
                }, settings.timeout);
                $(elements[last]).show();
						} else if ( settings.type === 'random_start' ) {
								settings.type = 'sequence';
								current = Math.floor ( Math.random () * ( elements.length ) );
								setTimeout(function (){
									$.fuFade.next(elements, settings, (current + 1) %  elements.length, current);
								}, settings.timeout);
								$(elements[current]).show();
						}	else {
              try{console.log('fuFade-Type must either be \'sequence\' or \'random\'');}catch(e){ }
						}
				}
    };

    $.fuFade.next = function (elements, settings, current, last, fuTimer) {
      clearTimeout(fuTimer); 
      
      next = current === (elements.length - 1) ? 0 : current + 1;
      prev = current === 0 ? elements.length - 1 : prev = current - 1;
         
          for ( i = 0; i < elements.length; i++ ) {
            if ((i !== last) && (i !== current))
            {
              $(elements[i]).css('z-index', '1');
              $(elements[i]).css('top', 0).css('left', 0);
              $(elements[i]).fadeOut(settings.speed);
            }
          }
      $(elements[last]).css('z-index', '190');
      $(elements[current]).css('z-index', '195');

            
      //Button Binding
      //Next
			$(".nextbtn").unbind('click');
			$(".nextbtn").bind('click',function (){
							clearTimeout(fuTimer);
							$.fuFade.next(elements, settings, next, current, fuTimer);
							return false;
			});
      //Back
			$(".backbtn").unbind('click');
			$(".backbtn").bind('click',function (){
							clearTimeout(fuTimer);
							$.fuFade.next(elements, settings, prev, current, fuTimer);
							return false;
			});

			//Fade Animation
        $(elements[last]).fadeOut(settings.speed);
        $(elements[current]).fadeIn(settings.speed, function () {
          $.fuFade.removeFilter($(this)[0]);
        });
        $(".backbtn").fadeTo("fast", 1);
        
				//Images in Sequence		
        if (settings.type === "sequence") {
            if ((current + 1) < elements.length) {
                current = current + 1;
                last = current - 1;
            } else {
                current = 0;
                last = elements.length - 1;
            }													
        }     
        //endbutton binding   
            
        fuTimer = setTimeout(function (){
            $.fuFade.next(elements, settings, next, prev, fuTimer);
        }, settings.timeout);
    };
    
    // **** remove Opacity-Filter in ie ****
    $.fuFade.removeFilter = function(element) {
      if(element.style.removeAttribute){
        element.style.removeAttribute('filter');
      }
    };
})(jQuery);