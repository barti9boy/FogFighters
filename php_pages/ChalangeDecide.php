<!DOCTYPE html>
<link rel="stylesheet" href="../css/style_lobby.css">
<?php
	session_start();
    include "../connectToDB.php";
?>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fog Fighters</title>
</head>
<body>
    <?php 
        $name  =$_SESSION['UserName'];
        $sql = "SELECT * FROM users WHERE UserName='$name'";
        mysqli_query($link, $sql);
        $ChallangeReq=mysqli_query($link, $sql);
		$existCount = mysqli_num_rows($ChallangeReq);
		if ($existCount > 0) {
			while($row = mysqli_fetch_assoc($ChallangeReq)){
                $opponent = $row['GameOpponent']; //osoba która rzuciła ci wyzwanie
            }
        }
    ?>
    <div class="wyzwanie"> 
    <h1>You have been challenged by <?php echo $opponent?></h1>
     
    <form action="./ChalangeDecide.php" method="post">
        <input type="submit" name="Accept" value="Accept" />
    </form>
    
    
    <form action="./ChalangeDecide.php" method="post">
        <input type="submit" name="Decline" value="Decline" />
    
    </form>
    </div>
    <?php
    
    if($_SERVER['REQUEST_METHOD'] == "POST" and isset($_POST['Accept']))
    {

        startGame();
    }
    if($_SERVER['REQUEST_METHOD'] == "POST" and isset($_POST['Decline']))
    {

        toLobby();
    }

    function startGame()
    {
        include "../connectToDB.php";
        $name  =$_SESSION['UserName']; //twój nick
        $token=rand(10000, 10000000); //nowe ID gry
        $sql = "UPDATE users SET GameId='$token' WHERE UserName='$name'";
        mysqli_query($link, $sql);

        $sql = "SELECT * FROM users WHERE UserName = '$name'";
		$ChallangeReq=mysqli_query($link, $sql);
		$existCount = mysqli_num_rows($ChallangeReq);
		if ($existCount > 0) {
			while($row = mysqli_fetch_assoc($ChallangeReq)){
                $opponent = $row['GameOpponent']; //osoba która rzuciła ci wyzwanie
            }
        }
        header("Location: ./RedirectToGame.php?id=$token&opponent=$opponent");
    }
    function toLobby()
    {
        print('declined');
        header("Location: ./RedirectToLobby.php");
    }
?>
</body>
</html>