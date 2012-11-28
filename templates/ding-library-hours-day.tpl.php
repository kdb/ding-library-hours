<?php
/**
 * @file
 * Template to render library opening hours for a single day.
 */
dpm($variables);
?>
<ul class="ding-library-hours-day">
<?php foreach ($hours as $node): ?>
  <li class="library" data-nid="<?php echo $node->nid; ?>">
    <?php echo l($node->title, 'node/' . $node->nid); ?>

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
