<?php
    session_start();
    include_once("../connectToDB.php");
    $name = $_SESSION['UserName'];
		$sql = "SELECT * FROM users WHERE UserName='$name'";
		$GameOnReq=mysqli_query($link, $sql);
		$existCount = $GameOnReq->num_rows;
		if ($existCount > 0) {
			while($row=$GameOnReq->fetch_assoc()){ 
                $row['LoggedIn'] = 0;
            }
        }
    session_destroy();
    header("Location: ../index.php");
?>