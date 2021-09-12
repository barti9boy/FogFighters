<?php
    function zabezpieczenie($data)
    {
        $data = trim($data); //usuwanie białych znaków z początku i końca ciągu
        $data = stripslashes($data); // usuwanie z ciągu znaku \
        $data = htmlspecialchars($data); //usuwanie z ciągu znaków specjalnych HTML
        return $data;
    }
?>