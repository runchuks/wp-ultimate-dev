<?php
/**
 * Plugin Name: WP Ultimate developer
 * Version: 1.1.0
 * Plugin URI: http://www.greenwiremedia.com/
 * Description: Development Tool
 * Author: JV@GWM
 * Author URI: http://www.greenwiremedia.com/
 * Requires at least: 4.0
 * Tested up to: 4.0
 *
 * Text Domain: wp-ultimate-dev
 *
 * @package WordPress
 * @author JV@GWM
 * @since 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require plugin_dir_path( __FILE__ ) . 'plugin-update-checker/plugin-update-checker.php';
$update_checker = Puc_v4_Factory::buildUpdateChecker(
	'https://github.com/runchuks/wp-ultimate-dev',
	__FILE__,
	'wp-ultimate-dev'
);
$update_checker->setBranch('master');
$update_checker->setAuthentication('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');

class WP_Ultimate_Developer{


    function __construct(){

        add_action( 'admin_menu', [$this,'admin_menu']);
        add_action( 'wp_ajax_get_tree', [$this,'get_tree'] );
        add_action( 'wp_ajax_get_file_content', [$this,'get_file_content'] );
        add_action( 'wp_ajax_set_file_content', [$this,'set_file_content'] );
        add_action( 'wp_ajax_new_file', [$this,'new_file'] );
    }
    function admin_menu(){
        add_menu_page(
          'WP Developer',
          'WP Developer',
          'manage_options',
          'wp-dev',
          [$this,'dev_page'],
          'dashicons-schedule',
          3
        );
    }
    function dev_page(){
        ?>
            <script src="https://unpkg.com/react@17/umd/react.development.js"></script>
            <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
            <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
            <script src="https://unpkg.com/prop-types@15.7.2/prop-types.js" crossorigin ></script>
            <script src="https://unpkg.com/state-local@1.0.7/lib/umd/state-local.min.js" crossorigin ></script>
            <script src="https://unpkg.com/@monaco-editor/loader@0.1.2/lib/umd/monaco-loader.min.js" crossorigin ></script>
            <script src="https://unpkg.com/@monaco-editor/react@4.0.0/lib/umd/monaco-react.min.js" crossorigin ></script>
            <script type="text/babel" src="<?=plugins_url('dist/js/script.js', __FILE__)?>"></script>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"/>
            <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>
            <link rel="stylesheet" href="<?=plugins_url('dist/css/styles.css', __FILE__)?>"/>
            <div id="root"></div>
        <?php
    }

    function get_tree(){
        $srv_root = $_SERVER['DOCUMENT_ROOT'];
        $root = $_POST['root'];
        $path = $root ? $root : $srv_root.'/';
        $tree = [];
        $dir = scandir($path);

        foreach($dir as $file){
            if($file !== '.' && $file !== '..'){
                $folder = is_dir($path.$file);
                $object = [
                  'name'    => $file,
                  'folder'  => is_dir($path.$file),
                  'info'    => pathinfo($path.$file)
                ];
                if($folder){
                    array_unshift($tree,$object);
                }else{
                    array_push($tree,$object);
                }
            }
        }
        wp_send_json([
            'debug'=> $path,
            'tree' => $tree
        ]);
    }

    function get_file_content(){
        $path = $_POST['path'];

        $content = file_get_contents($path);
        wp_send_json([
            'status'    => true,
            'content'   => $content
        ]);
    }
    function set_file_content(){
        $path = $_POST['path'];
        $content = $_POST['content'];
        try{
            $content = file_put_contents($path,stripslashes($content));
            wp_send_json([
                'success'   => true,
                'time'      => date('d.m.Y H:i:s',time())
            ]);
        }catch(Exception $e){
            wp_send_json_error([
                'error' => $e
            ]);
        }

    }

    function dirToArray($dir) {

       $result = array();

       $cdir = scandir($dir);
       foreach ($cdir as $key => $value)
       {
          if (!in_array($value,array(".","..")))
          {
             if (is_dir($dir . DIRECTORY_SEPARATOR . $value))
             {
                $result[$value] = $this->dirToArray($dir . DIRECTORY_SEPARATOR . $value);
             }
             else
             {
                $result[] = $value;
             }
          }
       }

       return $result;
    }
    function new_file(){
        $path = $_POST['path'];
        $filename = $_POST['filename'];

        $file = fopen($path.'/'.$filename, "w");
        fclose($file);

        wp_send_json([
            'debug' => [$path,$filename]
        ]);
    }
}
new WP_Ultimate_Developer();
