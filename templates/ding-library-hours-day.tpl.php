<?php
/**
 * @file
 * Template to render library opening hours for a single day.
 */
?>
<ul class="ding-library-hours-day">
<?php foreach ($hours as $node): ?>
  <li class="library clearfix" data-nid="<?php echo $node->nid; ?>">
    <h5 class="title">
      <?php echo l($node->title, 'node/' . $node->nid); ?>
    </h5>

    <ul class="hours">
    <?php foreach ($node->hours as $instance): ?>
      <li class="interval">
        <em class="start"><?php echo theme('ding_library_hours_time', $instance->start_time); ?></em> –
        <em class="end"><?php echo theme('ding_library_hours_time', $instance->end_time); ?></em>
      </li>
    <?php endforeach; ?>
    </ul>
  </li>
<?php endforeach; ?>
</ul>
