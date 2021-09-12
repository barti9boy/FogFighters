<!DOCTYPE html>
<?php
	session_start();
    include "../connectToDB.php";
?>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Instruction</title>
    <link rel="stylesheet" href="../css/instrukcja.css" type="text/css">
</head>
<body>
     
    <header>
        <video class="video-container" muted autoplay loop>
          <source src="../images/fog3.mp4" type="video/mp4" />
        </video>
    

    <?php include 'header.php'; 
    $login = $_SESSION["login"];
    $sql = "UPDATE users SET LoggedIn=0 WHERE UserName='$login'";
		mysqli_query($link, $sql);?>

    <article>
    <h1>Instruction</h1>
    <h3>Fog Fighters is a online 2-player game</h3> <br>

    <p>Both players have 4 by 4 boards, on which they arrange their units. These units are: Warrior, Rogue and Archer (each described below). Players do not see each other's boards. After both players located their units on the boards, they each take turns in which they try to hit and eliminate oponent's units. To do so, they must first choose a unit to attack with, and then choose suitable squares on oponent's board. Each unit has unique pattern of attack, and damage they deal to hostile units. Player is informed about successful hits, however he will not be informed which unit or units he attacked or how much damage he delt. Unit that was hit will loose health points equal to the number of damage points attacker delt to that square. When unit's life will be lower or equal to 0, the unit is eliminated and the player is informed that a lethal strike is delivered. After a unit is eliminated from the game, it can no longer be used to attack oponent's board. The first player to eliminate all of oponent's units wins.</p>
   
    <div class='choices'>
      <div class='choice' id = 'w'>
      <h3>Warrior</h3><p></p>
    <img
          width="150"
          height="150"
          src="../images/warrior.png" align = 'left'
        /> <br>
        Can be located in the first row of your board <br>
        Health points: 40<br>
        Attack pattern: attacks two adjacent squares, deals 8 damage points to each (might be patched later)</br></div>
        <div class='choice' id = 'r'>
        <h3>Rogue</h3>
    <img
          width="150"
          height="150"
          src="../images/rogue.png" align = 'left'
        /> <br><br> Can be located in the second or third row of your board<br>
          Health points: 10<br>
          Attack pattern: attacks two oblique squares, deals 20 damage points to each</br></div>
        <div class='choice' id = 'a'>
        <h3>Archer</h3>
    <img
          width="150"
          height="150"
          src="../images/archer.png" align = 'left'
          
    /> <br>
    Can be located in the fourth row of your board<br>
    Health points: 24 <br>
    Attack pattern: shoots an arrow into a selected column, and deals 12 damage only to the first unit it hits. If there is more than one enemy unit in the column, the priority of the hit will be Warrior-Rogue-Archer (hight to low)</br>
</div>
     </article>
     </header>

</body>
