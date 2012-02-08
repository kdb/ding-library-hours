(function ($) {
  "use strict";

  // This is filled with week view placeholder when the DOM is ready.
  var viewPlaceholder;

  var createWeekView = function (nid) {
    // The WeekPresentationView instance requires these miscellaneous
    // things to be provided on load, so here they are.
    var curDate = new Date().getISODate(),
        dayTemplate = _.template($('#oho-day-presentation-template').html()),
        instanceTemplate = _.template($('#oho-instance-presentation-template').html()),
        week = new Drupal.OpeningHours.Week(curDate, Drupal.settings.OpeningHours.firstDayOfWeek),
        el = viewPlaceholder.clone(),
        view;

    el.attr('data-nid', nid);

    // Create a WeekPresentationView instance, just like in
    // opening_hours.presentation.js
    view = new Drupal.OpeningHours.WeekPresentationView({
      date: curDate,
      dayTemplate: dayTemplate,
      el: el,
      firstDayOfWeek: Drupal.settings.OpeningHours.firstDayOfWeek,
      instanceTemplate: instanceTemplate,
      nid: nid,
      week: week
    });

    return view;
  };

  // When the document is ready, snatch up a copy of a placeholder.
  $(function() {
    viewPlaceholder = $('.opening-hours-week.placeholder').eq(0).clone();
  });

  // When Opening Hours is done setting up, we want to do our thing.
  $(window).bind('OpeningHoursLoaded', function () {

    $('.opening-hours-week').each(function () {
      var nid = parseInt($(this).attr('data-nid'), 10), select;

      if (Drupal.settings.ding.libraryHours[nid]) {
        select = $('<select></select');

        $.each(Drupal.settings.ding.libraryHours[nid], function (nid, title) {
          $('<option></option>')
            .attr('value', nid)
            .text(title)
            .appendTo(select);
        });

        // When a different department is selected, change the display
        // shown to the relevant department’s hours.
        select.change(function () {
          var $this = $(this),
              nid = $this.val(),
              parent = $this.parent(),
              showView;

          // Fade out currently visible hours.
          parent.find('.opening-hours-week:visible').fadeOut(function () {
            // Find the week-view we want to show now.
            showView = parent.find('.opening-hours-week[data-nid=' + nid + ']');

            // If display does not exist, create it.
            if (showView.length < 1) {
              createWeekView(nid).render().el.insertBefore(select);
            }
            // Otherwise, just fade it in.
            else {
              showView.fadeIn();
            }
          });
        });

        // Add the select right after the original opening hours widget.
        select.insertAfter(this);
      }
    });

  });

}(jQuery));
