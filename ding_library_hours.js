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

  // When the document is ready...
  $(function() {
    // Snatch up a copy of a placeholder.
    viewPlaceholder = $('.opening-hours-week.placeholder').eq(0).clone();

    // As a workarond for http://drupal.org/node/1472434, create an
    // index of which nodes have extra data and where in the list their
    // data is, since the data array cannot be keyed by nid.
    Drupal.libraryHoursDataIndexes = {};
    $.each(Drupal.settings.ding.libraryHours, function (idx, data) {
      var nid;

      // Extract the nid from the first item.
      $.each(data, function (iterNid, iterData) {
        if (!nid) {
          nid = iterNid;
        }
      });

      Drupal.libraryHoursDataIndexes[nid] = idx;
    });
  });

  // When Opening Hours is done setting up, we want to do our thing.
  $(window).bind('OpeningHoursLoaded', function () {

    $('.opening-hours-week').each(function () {
      var nid = parseInt($(this).attr('data-nid'), 10),
          // Numeric keys are broken in Drupal 6, this is a workaround.
          // See http://drupal.org/node/1472434
          key = Drupal.libraryHoursDataIndexes[nid],
          select;

      if (Drupal.settings.ding.libraryHours[key]) {
        select = $('<select></select>');

        $.each(Drupal.settings.ding.libraryHours[key], function (nid, title) {
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

        // Add a wrapper div for easier styling.
        select.wrap('<div class="ding-library-hours-department-selector"></div>');
      }
    });

  });

}(jQuery));
