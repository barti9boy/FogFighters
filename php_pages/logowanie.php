<?php session_start(); ?>

<?php
    include_once("../connectToDB.php"); //łączenie z bazą danych
    require('funkcje.php'); 

    if(isset($_POST["zaloguj"])) {

        $login = zabezpieczenie($_POST['login']);
        $haslo = zabezpieczenie($_POST['haslo']);
        $pswrd1 = sha1($haslo);
        unset($haslo);
        $sql = "SELECT * FROM users WHERE UserName = '$login' AND UserPassword = '$pswrd1'";
        $result = mysqli_query($link, $sql);

        if(mysqli_num_rows($result) > 0) {
            while($row = mysqli_fetch_assoc($result)) {
                $login = $row['UserName'];
                $_SESSION['login'] = $login;
                $_SESSION['password'] = $pswrd1;
            }
            header("Location: profil.php");
        }
        else {
            echo "Invalid username or password"; 
        }

       
    }
?>