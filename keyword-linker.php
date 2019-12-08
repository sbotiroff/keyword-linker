<?php
/*
Plugin Name: Keyword Linker
Plugin URI: 
Description: Keyword Linker is the latest plugin designed to find words from the whole website and attaches the link at the selected position of the word. Also can select the pages and able to see the source code of the page or whole page. It will automatically highlight the word that found.
Version: 1.0
Author: VisualWebz LLC
Author URI: 
Text Domain: keyword-linker
License: GNU General Public License v2 or later
*/

if (!defined('ABSPATH')) exit; //Exit if accessed directly.

//KL stands for Keyword Linker

defined('ABSPATH') or die('No script kiddies please!');

//path of the plugin
define('KL_PLUGIN_PATH', plugin_dir_path(__FILE__));

//adding menus to the admin menu
add_action('admin_menu', 'kl_setup_menu');

//function that creates menus
function kl_setup_menu()
{
    add_menu_page('Keyword Linker page', 'Keyword Linker', 'manage_options', 'kl_plugin_menu', 'kl_main_layout', '', 2);
    add_submenu_page('kl_plugin_menu', 'Keyword Linker Page', 'Keyword Linker', 'manage_options', 'kl_layout', 'kl_layout');
    remove_submenu_page('kl_plugin_menu', 'kl_plugin_menu');
}

//main layout of the plugin
function kl_main_layout()
{
    echo "<h1>Welcome to the home page of Plug-in</h1>";
}

//function that calls Page Creator Layout
function kl_layout()
{
    echo "<h1>Keyword Linker</h1>";
    include KL_PLUGIN_PATH . 'view/kl_layout.php';
}


//adding all js scripts and styling to the header
function kl_enqueue_script($hook)
{
    if ('keyword-linker_page_kl_layout' != $hook) {
        return;
    }
    wp_enqueue_script('tiny_mce');
    wp_enqueue_script('jquery');
    wp_enqueue_script('kl_functions_script', plugins_url('assets/js/kl_scripts.js', __FILE__));
    wp_enqueue_style('kl_custom_style', plugins_url('assets/css/kl_style.css', __FILE__));
}
//adding mpg_enqueue_script to the admin page
add_action('admin_enqueue_scripts', 'kl_enqueue_script');

add_action('wp_ajax_nopriv_klUploadTheContent', 'klUploadTheContent');
add_action('wp_ajax_klUploadTheContent', 'klUploadTheContent');


function klUploadTheContent(){
    // Update post 37
$my_post = array(
    'ID'           => sanitize_text_field($_POST['id']),
    'post_content' => sanitize_text_field($_POST['content']),
);
// Update the post into the database
wp_update_post( $my_post );
	echo 'Saved';
    die();
}