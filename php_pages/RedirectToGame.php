<?php
	//this codes executes when player accepts a duel
	session_start();
	include "../connectToDB.php";
	
	$UserName=$_SESSION['UserName'];
	
	$opponent=$_GET["opponent"];
	$_SESSION['Opponent']=$opponent;

	$token=$_GET["id"];
	$_SESSION['GameId'] = $token;

	/*AKTUALIZACJA BAZY DANYCH PRZED WEJŚCIEM DO GRY*/
	$sql = "UPDATE users SET GameId='$token',GameOpponent='$opponent' WHERE UserName='$UserName'";
	mysqli_query($link, $sql);
	$sql = "UPDATE users SET GameId='$token',GameOpponent='$UserName' WHERE UserName='$opponent'";
	mysqli_query($link, $sql);
	$sql = "UPDATE gameinfo SET GameId='$token',Player1='$UserName', Player2='$opponent' WHERE Port='4000'";
	mysqli_query($link, $sql);

	//header("Location: ./Game.php?id=$token");
	header("Location: http://127.0.0.1:4000");
?>