<?php session_start(); ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - FogFighters</title>
    <link rel="stylesheet" href="../css/style_strona_startowa.css"> 
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/css/all.min.css"/>
</head>
<body>
    
    <main>    
    <header class="hero">
        
            <video class="video-container" muted autoplay loop>
                <source src="../images/fog3.mp4" type="video/mp4" />
            </video>
        
        <div class="banner">
            <h4 class="logo">FogFighters</h4>
            <h2>Login</h2>
            <div class="formLog">    
                <form action="/../php_pages/logowanie.php" method="POST"> 
                    <input type="text" id="login" name="login" placeholder="username" required="required"><br> 
                    <input type="password" id="haslo" name="haslo" placeholder="password" required="required"><br><br>
                    <input type="submit" name="zaloguj" value="log in">
                </form>
            </div>
            <h3>or</h3>
            <button class="btn modal-btn">sign in</button><br>
            <!-- <form class="instr" action="/index.php">
                <input type="submit" name="instruction" value="instruction">
            </form> -->
            <a class="instr" href="../php_pages/instrukcja2.php">instruction</a>
        </div>
    </header>

    <?php
        // if(isset($_POST['instruction'])) {
        //     header("Location: php_pages/instrukcja2.php");
        // }
    ?>

    <div class="modal-overlay">
        <div class="modal-container">
            <div class="formReg">
                <h2>Registration</h2>
                <form action="/../php_pages/rejestracja.php" method="POST"> 
                    <input type="text" id="reglogin" name="reglogin" placeholder="username" required="required"><br>
                    <input type="password" id="reghaslo" name="reghaslo" placeholder="password" required="required"><br>
                    <input type="password" id="reghaslopowtorz" name="reghaslopowtorz" placeholder="enter your password again" required="required"><br><br>
                    <input type="submit" id="reg" name="zarejestruj" value="Create your account">
                </form>
            </div>
            <button class="close-btn">
                <i class="fas fa-times"></i>
            </button>
        </div>
    </div>
    </main>
    <script src="../js/rejestracja_modal.js"></script>
    
</body>
</html>