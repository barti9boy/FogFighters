<?php
	session_start();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Fog Fighters - Lobby</title>
    <link rel="stylesheet" href="../css/style_lobby.css">
</head>
<body>
    <header class="hero">
    <?php include 'header.php'; ?>
        <video class="video-container" muted autoplay loop>
          <source src="../images/fog3.mp4" type="video/mp4" />
        </video>
        <div class="banner">
    
            <h2>Lobby</h2>
            <?php 
            $login = $_SESSION['login'];
            printf("<h1>$login</h1>");
            ?>
            
            <h4>Available Players:</h4>
            <div id="AvailablePlayers">
            </div>
        </div>
    </header>


    <script src="../js/jquery.js"></script>	
    <script src="../js/availablePlayers.js"></script>
    <script src="../js/challange_modal.js"></script>

</body>
</html>