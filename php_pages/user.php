<?php
class user{
    private $UserId,$UserLoggedIn,$UserName,$UserPassword,$UserGameId,$UserGameOpponent,$UserWins,$UserLoses,$UserKilledWarriors,$UserKilledRogues,$UserKilledArchers; //zmienne z bazy danych

    public function getUserId(){
		return $this->UserId;
	}
	public function setUserId($UserId){
		return $this->UserId=$UserId;
	}
	
	public function getUserLoggedIn(){
		return $this->UserLoggedIn;
	}
	public function setUserLoggedIn($UserLoggedIn){
		return $this->UserLoggedIn=$UserLoggedIn;
	}
	
	public function getUserName(){
		return $this->UserName;
	}
	public function setUserName($UserName){
		return $this->UserName=$UserName;
	}

    public function getUserPassword(){
		return $this->UserPassword;
	}
	public function setUserPassword($UserPassword){
		return $this->UserPassword=$UserPassword;
	}

	//GameID: 0 - not in a game, 1 - pending challange, !=0 && !=1 - in game
	public function getUserGameId(){ 
		return $this->UserGameId;
	}
	public function setUserGameId($UserGameId){
		return $this->UserGameId=$UserGameId;
	}
	
	public function getUserGameOpponent(){
		return $this->UserGameOpponent;
	}
	public function setUserGameOpponent($UserGameOpponent){
		return $this->UserGameOpponent=$UserGameOpponent;
	}

    public function getUserWins(){
		return $this->UserWins;
	}
	public function setUserWins($UserWins){
		return $this->UserWins=$UserWins;
	}

    public function getUserLoses(){
		return $this->UserLoses;
	}
	public function setUserLoses($UserLoses){
		return $this->UserLoses=$UserLoses;
	}

    public function getUserKilledWarriors(){
		return $this->UserKilledWarriors;
	}
	public function setUserKilledWarriors($UserKilledWarriors){
		return $this->UserKilledWarriors=$UserKilledWarriors;
	}

    public function getUserKilledRogues(){
		return $this->UserKilledRogues;
	}
	public function setUserKilledRogues($UserKilledRogues){
		return $this->UserKilledRogues=$UserKilledRogues;
	}

    public function getUserKilledArchers(){
		return $this->UserKilledArchers;
	}
	public function setUserKilledArchers($UserKilledArchers){
		return $this->UserKilledArchers=$UserKilledArchers;
	}



    public function LoginToLobby(){
        include "../connectToDB.php";
        $login = $this->getUserName();
		$password = $this->getUserPassword();
		$gameId = $this->getUserGameId();
		$gameOpponent = $this->getUserGameOpponent();
		$sql = "UPDATE users SET LoggedIn=1 WHERE UserName='$login' AND UserPassword='$password'";
		mysqli_query($link, $sql);
		$sql = "UPDATE users SET GameId='$gameId' WHERE UserName='$login' AND UserPassword='$password'";
		mysqli_query($link, $sql);
		$sql = "UPDATE users SET GameOpponent='$gameOpponent' WHERE UserName='$login' AND UserPassword='$password'";
		mysqli_query($link, $sql);
		$sql= "SELECT * FROM users WHERE UserName='$login' AND UserPassword='$password'";
		$UserRequest = mysqli_query($link, $sql);
        if($UserRequest->num_rows==0){ //ten kod wykonuje się kiedy ktoś jest niezalogowany
            header("Location: ../index.php?error=1"); 
            return false;
        }
        else{
            while($row=$UserRequest->fetch_array()){
				$this->setUserId($row['UserId']);
				$this->setUserLoggedIn($row['LoggedIn']);
				$this->setUserGameId($row['GameId']);
				$this->setUserGameOpponent($row['GameOpponent']);
                $this->setUserWins($row['Wins']);
                $this->setUserLoses($row['Loses']);
                $this->setUserKilledWarriors($row['KilledWarriors']);
                $this->setUserKilledRogues($row['KilledRogues']);
                $this->setUserKilledArchers($row['KilledArchers']);
                header("Location: Lobby.php");
				return true;
			}
        }
    }


	public function DisplayAvailablePlayers(){
		include "../connectToDB.php";
		$sql = "SELECT * FROM users ORDER BY UserName";
		$UserReq=mysqli_query($link, $sql);
		$existCount = $UserReq->num_rows;
		if ($existCount == 0) { // evaluate the count
			return "";
		}
		if ($existCount > 0) {
			while($row = $UserReq->fetch_assoc()){
				$name = $row["UserName"];
				if($row["UserName"] != $_SESSION['UserName'] and $row["LoggedIn"] != 0) { //nie pokazujemy w lobby nas samych i ktoś musi być online
					if ($row["GameId"] != 0 and $row["GameId"] != 1) {
						$available = "is currently in game";
					}elseif($row["GameId"] == 1){
						$available = "has a pending challange";
					}
					elseif($row["GameId"] == 0){
						$available = "is available to play";
					}
					if ($row["GameId"] != 0 and $row["GameId"] != 1) {
						?>
						<span style="color:red" class="UserNames"> <?php echo $name;?>					
						</span>
						<?php
					} elseif ($row["GameId"] == 1) {
						?>
						<span style="color:yellow" class="UserNames"> <?php echo $name;?>					
						</span>
						<?php
					} elseif ($row["GameId"] == 0){
						?>
						<span class="UserNames" onclick="parent.location='challangeSent.php?name=<?php echo $name;?>&opponent=<?php echo $_SESSION['UserName'];?>';"> <?php echo $name;?>
						</span>
						<?php
						
					}
					?>
						</span> 
						<span class="text" > <?php echo $available;?>
						</span> </br>
					<?php
				}
			}
		}
	}
	public function CheckForChallange(){
		include "../connectToDB.php";
		$name = $_SESSION['UserName']; //$this->getUserName
		$sql = "SELECT * FROM users WHERE UserName = '$name'";
		$ChallangeReq=mysqli_query($link, $sql);
		$existCount = mysqli_num_rows($ChallangeReq);
		if ($existCount > 0) {
			while($row = mysqli_fetch_assoc($ChallangeReq)){
				if ($row["GameId"] == 1) { //kiedy nas ktoś zaprosi do gry GameId ==1
					$opponent = $row["GameOpponent"];
					$sql = "SELECT * FROM users WHERE UserName = '$opponent'";
					$result=mysqli_query($link, $sql);
					$existCount = mysqli_num_rows($result);
					while($row2 = mysqli_fetch_assoc($result)){
						if($row2["GameOpponent"] == ""){
							header("Location: ./ChalangeDecide.php");
						}
						else{

							header("Location: ./RedirectToLobby.php");
						}
					}
					
				}
			}
		}
	}
	public function CheckForGame(){ //if someone accepted your challange, your GameId will change
		include "../connectToDB.php";
		$name = $_SESSION['UserName'];
		$sql = "SELECT * FROM users WHERE UserName='$name'";
		$GameOnReq=mysqli_query($link, $sql);
		$existCount = $GameOnReq->num_rows;
		if ($existCount > 0) {
			while($rowGameOn=$GameOnReq->fetch_assoc()){ 
				if ($rowGameOn["GameId"] != 0 and $rowGameOn["GameId"] != 1) {  //jeśli challange został zaakceptowany
					$sql = "SELECT * FROM users WHERE GameOpponent='$name' AND GameId > 1"; //chcemy znaleźć osobę która ma nas jako przeciwnika i przeszła do gry czyli jej GameId>1
					$result=mysqli_query($link, $sql);
					$existCount2 = $result->num_rows;
					if ($existCount2 > 0) {
						while($row=$GameOnReq->fetch_assoc()){
							$opponent = $row["UserName"];
							$token = $row["GameId"];
						}
						print "<script>document.location.href='http://127.0.0.1:4000'</script>";
						
					}
					
				}
			}
		}
	}
}
?>