jQuery(document).ready(function($) {
	$.fn.streakwp = function(massive, options) {
		var $_this = $(this);
		var settings = $.extend({
			eventClick: function(e) {
				alert("Date: " + e.date + ", Count:" + e.count);
			},
			months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
			weeks: ["M", "T", "W", "T", "F", "S", "S"],
			targetQuantity: ".streak-wp-quantity",
			tagId: "streak-wp-svgTag",
			showToday: true,
			today: new Date()
		}, options);
		var svgElement = createElementSvg("svg", {
			"width": 54 * 12 + 15,
			"height": 7 * 12 + 15
		});
		var gElementContainer = createElementSvg("g", {
			"transform": "translate(15, 15)"
		});
		var $_tag = $("<div>").addClass("svg-tag").attr("id", settings.tagId).appendTo($("body")).hide();
		var dayCount = 366;
		var monthCount;
		for (var i = 0; i < 54; i += 1) {
			var gElement = createElementSvg("g", {
				"transform": "translate(" + (12 * i) + ",0)"
			});
			var firstDate = new Date();
			firstDate.setMonth(settings.today.getMonth());
			firstDate.setFullYear(settings.today.getFullYear());
			firstDate.setDate(settings.today.getDate() - dayCount - 1);
			var daysLeft = daysInMonth(firstDate) - firstDate.getDate();
			for (var j = firstDate.getDay(); j < 7; j += 1) {
				var rectDate = new Date();
				rectDate.setMonth(settings.today.getMonth());
				rectDate.setFullYear(settings.today.getFullYear());
				rectDate.setDate(settings.today.getDate() - dayCount);
				if (rectDate.getMonth() != monthCount && i < 52 && j > 3 && daysLeft > 7) {
					var textMonth = createElementSvg("text", {
						"x": 12 * i,
						"y": "-6",
						"class": "month"
					});
					textMonth.textContent = getNameMonth(rectDate.getMonth());
					gElementContainer.appendChild(textMonth);
					monthCount = rectDate.getMonth()
				}
				dayCount -= 1;
				if (dayCount >= 0 || (settings.showToday && dayCount >= -1)) {
					var rectElement = createElementSvg("rect", {
						"class": "day",
						"width": "10px",
						"height": "10px",
						"data-date": rectDate.getFullYear() + "-" + (rectDate.getMonth() + 1) + "-" + rectDate.getDate(),
						"y": 12 * j
					});
					/*rectElement.onmouseover = function() {
						var dateString = $(this).attr("data-date").split("-");
						var date = new Date(dateString[0], dateString[1] - 1, dateString[2]);
						var tagDate = getBeautyDate(date);
						var tagCount = $(this).attr("data-count");
						var tagCountData = $(this).attr("data-count");
						if (tagCountData) {
							if (tagCountData > 1) {
								tagCount = $(this).attr("data-count") + " posts"
							} else {
								tagCount = $(this).attr("data-count") + " post"
							}
						} else {
							tagCount = "No posts"
						}
						$_tag.html("<b>" + tagCount + "</b> on " + tagDate).show().css({
							"left": $(this).offset().left - $_tag.outerWidth() / 2 + 5,
							"top": $(this).offset().top - 33
						})
					};
					rectElement.onmouseleave = function() {
						$_tag.text("").hide()
					};*/
					rectElement.onclick = function() {
						settings.eventClick({
							date: $(this).attr("data-date"),
							count: $(this).attr("data-count") || 0
						})
					};
					gElement.appendChild(rectElement)
				}
			}
			gElementContainer.appendChild(gElement)
		}
		var textM = createElementSvg("text", {
			"x": "-14",
			"y": "8"
		});
		textM.textContent = getNameWeek(0);
		gElementContainer.appendChild(textM);
		var textW = createElementSvg("text", {
			"x": "-14",
			"y": "32"
		});
		textW.textContent = getNameWeek(2);
		gElementContainer.appendChild(textW);
		var textF = createElementSvg("text", {
			"x": "-14",
			"y": "56"
		});
		textF.textContent = getNameWeek(4);
		gElementContainer.appendChild(textF);
		var textS = createElementSvg("text", {
			"x": "-14",
			"y": "80"
		});
		textS.textContent = getNameWeek(6);
		gElementContainer.appendChild(textS);
		svgElement.appendChild(gElementContainer);
		$_this.append(svgElement);
		fillData(massive);

		function createElementSvg(type, prop) {
			var e = document.createElementNS("http://www.w3.org/2000/svg", type);
			for (var p in prop) {
				e.setAttribute(p, prop[p])
			}
			return e
		}

		function fillData(massive) {
			var postCount = 0;
			for (var m in massive) {
				$_this.find("rect.day[data-date=" + massive[m].date + "]").attr("data-count", massive[m].value);
				postCount += parseInt(massive[m].value)
			}
			$(settings.targetQuantity).text(massive.length + " days, " + postCount + " posts")
		}

		function getNameMonth(a) {
			return settings.months[a]
		}

		function getNameWeek(a) {
			return settings.weeks[a]
		}

		function getBeautyDate(a) {
			return getNameMonth(a.getMonth()) + " " + a.getDate() + ", " + a.getFullYear()
		}

		function daysInMonth(d) {
			return 32 - new Date(d.getFullYear(), d.getMonth(), 32).getDate()
		}
	}
});

// Initialization code added here
jQuery(document).ready(function($) {
	$("#js-streak-wp").streakwp(
		massive,
		{
			eventClick: function(e) {
				$(".streak-wp-info").html("Date: " + e.date + ", Posts: " + e.count);
			},
			showToday: false
		}
	);
});
