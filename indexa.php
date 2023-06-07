<?php

function listar_archivos($carpeta){
    if(is_dir($carpeta)){
        if($dir = opendir($carpeta)){
            while(($archivo = readdir($dir)) !== false){
                if($archivo != '.' && $archivo != '..' && $archivo != '.htaccess'){
                    echo ' | <a href="'.$carpeta.'/'.$archivo.'">'.$archivo.'</a>';
                }
            }
	    echo ' | ';
            closedir($dir);
        }
    }
}

echo listar_archivos('ci');

?>
