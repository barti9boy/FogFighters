<?php session_start(); ?>
<?php
     
    include_once("../connectToDB.php"); //łączenie z bazą danych
    include 'profil2.php';
    require('funkcje.php'); 
    printf("<h2>Nickname:</h2>");
    printf("<br>"); 


    
    $login = $_SESSION["login"];
    printf("<h1>$login</h1>");
    $sql = "UPDATE users SET LoggedIn=0 WHERE UserName='$login'";
	mysqli_query($link, $sql);
    $sql= "SELECT * FROM users WHERE UserName='$login'";
    $user_statistics = mysqli_query($link, $sql);

    while($row=$user_statistics->fetch_array()){

        $wins = $row['Wins'];
        $loses = $row['Loses'];
        $UserKilledWarriors = $row['KilledWarriors'];
        $UserKilledRogues = $row['KilledRogues'];
        $UserKilledArchers = $row['KilledArchers'];
    }
    
    printf("<ul class=statistic>
        <li>
            <h4>Wins: $wins</h4>
        </li>
        <li>
            <h4>Loses: $loses</h4>
        </li>
        <li>
            <h4>Killed Warriors: $UserKilledWarriors</h4>
        </li>
        <li>
            <h4>Killed Rogues: $UserKilledRogues</h4>
        </li>
        <li>
            <h4>Killed Archers: $UserKilledArchers</h4>
        </li>
      </ul>");



    $link->close(); //zamknięcie połączenia

    print<<<KONIEC
    
    KONIEC;

?>