<?php
/*
Plugin Name: Streak WP
Description: Display a chart of published post activity on your dashboard.
Version: 1.0.3.3
Requires at least: 5.0
Author: Jay Venka
Author URI: https://jayvenka.com/
License: GPL
License URI: https://www.gnu.org/licenses/gpl.html
Text Domain: streak-wp
*/

if ( ! defined( 'ABSPATH' ) ) exit;

add_action( 'admin_enqueue_scripts', 'streakwp_admin_enqueue' );
function streakwp_admin_enqueue() {
    wp_enqueue_style( 'streakwp-style', plugin_dir_url( __FILE__ ) . 'css/streak-wp.css', array(), '1.0' );
    wp_enqueue_script( 'jquery' );
    wp_register_script( 'streakwp-script', plugin_dir_url( __FILE__ ) . 'js/streak-wp.js', array( 'jquery' ), '1.0', true );

    // Adding async and defer attributes to the script
    wp_script_add_data( 'streakwp-script', 'async', true );
    wp_script_add_data( 'streakwp-script', 'defer', true );

    wp_enqueue_script( 'streakwp-script' );
}

add_action( 'wp_dashboard_setup', 'streakwp_dashboard_widget' );
function streakwp_dashboard_widget() {
    global $wp_meta_boxes;
    wp_add_dashboard_widget( 'streakwp_widget', esc_html__( 'Streak WP', 'streak-wp' ), 'streakwp_dashboard_content' );
}

function streakwp_dashboard_content() {
    $args = array(
        'posts_per_page' => -1,
        'post_type' => array( 'post', 'page' ),
        'post_status' => 'publish',
        'date_query' => array( 'after' => '1 year ago' )
    );
    $posts = get_posts( $args );
    $allowed = array();
    $streakwplist = '';
    $count = array();

    foreach ( $posts as $post ) {
        $date = get_the_date( 'Y-n-j', $post );
        $count[$date] = !isset( $count[$date] ) ? 1 : $count[$date] + 1;
        $streakwplist .= '{date: "' . esc_js( $date ) . '", value: "' . esc_js( $count[$date] ) . '"},';
    }
    ?>
    <div id="streak-wp" class="streak-wp-container">
        <h1 class="streak-wp-header"><?php esc_html_e('Year in Review', 'streak-wp'); ?> <span class="streak-wp-info"></span></h1>
        <div id="js-streak-wp" class="streak-wp-content"></div>
        <div class="streak-wp-summary">
            <div class="streak-wp-legend">
                <?php esc_html_e('Less', 'streak-wp'); ?>&nbsp;
                <span style="background-color:#eee"></span>
                <span style="background-color:#c3dbda"></span>
                <span style="background-color:#5caeaa"></span>
                <span style="background-color:#277672"></span>
                &nbsp;<?php esc_html_e('More', 'streak-wp'); ?>
            </div>
            <span class="streak-wp-quantity"></span>
        </div>
    </div>
    <p><?php esc_html_e('check out:', 'streak-wp'); ?> <a href="<?php echo esc_url('https://adtwp.com/'); ?>" target="_blank">SEO content audit plugin </a> <?php esc_html_e('by Jay Venka', 'streak-wp'); ?>.</p> 

    <?php
    // Pass the data to the script
    $inline_script_data = "var massive = [" . wp_kses( $streakwplist, $allowed ) . "];";
    wp_add_inline_script( 'streakwp-script', $inline_script_data, 'before' );
}
?>
