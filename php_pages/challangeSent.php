<?php
    session_start();
    include "../connectToDB.php"; 
    $name=$_GET["name"]; //nazwa osoby na którą kliknęliśmy
    $opponent=$_GET['opponent']; //nasza nazwa

    /*Ustawiamy przeciwnikowi GameID i oponenta*/
    $sql = "UPDATE users SET GameId=1 WHERE UserName='$name'";
    mysqli_query($link, $sql);
    $sql = "UPDATE users SET GameOpponent='$opponent' WHERE UserName='$name'"; 
    mysqli_query($link, $sql);

    /*Ustawiamy nam GameID i oponenta*/
    header("Location: RedirectToLobby.php");
?>