<?php
session_start();
include "./user.php";
    $user = new user();
    $user->setUserName($_SESSION['login']);
    $user->setUserPassword($_SESSION['password']);
    $user->setUserGameId(0);
    $user->setUserGameOpponent('');
    if($user->LoginToLobby()==true){ //metoda zawarta w klasie User
        $_SESSION['UserId']=$user->getUserId();
		$_SESSION['UserName']=$user->getUserName();
        $_SESSION['UserLoggedIn']=$user->getUserLoggedIn();
        $_SESSION['GameId']=$user->getUserGameId();
		$_SESSION['Opponent']=$user->getUserGameOpponent();
        $_SESSION['Wins']=$user->getUserWins();
        $_SESSION['Loses']=$user->getUserLoses();
        $_SESSION['KilledWarriors']=$user->getUserKilledWarriors();
        $_SESSION['KilledRogues']=$user->getUserKilledRogues();
        $_SESSION['KilledArchers']=$user->getUserKilledArchers();
    }