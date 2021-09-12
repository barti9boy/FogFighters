<?php session_start(); ?>
<?php 
    
    include_once("../connectToDB.php");
    require('funkcje.php');

        if (isset($_POST['zarejestruj']) && is_string($_POST['reglogin']) && is_string($_POST['reghaslo']) && is_string($_POST['reghaslopowtorz']))
        {
            $login = zabezpieczenie($_POST['reglogin']);
            $haslo = zabezpieczenie($_POST['reghaslo']);
            $hasloPonownie = zabezpieczenie($_POST['reghaslopowtorz']);
            
            $pswrd1 = sha1($haslo);
            $pswrd2 = sha1($hasloPonownie);
            unset($haslo, $hasloPonownie);

            if($pswrd1 == $pswrd2) {

                $sql = "INSERT INTO users(UserName,UserPassword) VALUES(?,?)"; $stmt = $link->prepare($sql);
                $stmt->bind_param("ss", $login, $pswrd1); $result = $stmt->execute();
                $_SESSION['login'] = $login;
                $_SESSION['username'] = $login;
                $_SESSION['password'] = $pswrd1;
                header("Location: profil.php"); 
                $stmt->close();

                if (!$result) {
                printf("Query failed: %s\n", mysqli_error($link));
                }
            }
            else {
                header ("Location: ../index.php");
            }
        }
        else 
        {
            //$_SESSION["login"] = 0;
            header ("Location: ../index.php");
        }

    $result->free(); //wyczyszczenie pamięci zajmowanej przez pobrane z bazy dane

    $link->close(); //zamknięcie połączenia
?>