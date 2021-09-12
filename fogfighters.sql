CREATE TABLE users(
	UserId int(11) NOT NULL auto_increment,
	UserName varchar(50) NOT NULL,
	UserPassword varchar(50) NOT NULL,
	LoggedIn int(1) NOT NULL,
	GameOpponent varchar(50) NOT NULL,
	GameId int(11) NOT NULL,
	Wins int(11) NOT NULL,
	Loses int(11) NOT NULL,
	KilledWarriors int(11) NOT NULL,
	KilledRogues int(11) NOT NULL,
	KilledArchers int(11) NOT NULL,
	PRIMARY KEY (UserId)
);

CREATE TABLE gameinfo(
	Port int(11) NOT NULL,
	GameId int(11) NOT NULL,
	Player1 varchar(50) NOT NULL,
	Player2 varchar(50) NOT NULL,
	
	PRIMARY KEY (Port)
);

INSERT INTO gameinfo (Port) VALUES (4000);



	--tworzymy w localhost/phpmyadmin nową baze danych o nazwie fogfighters 
	--przechodzimy do zakładki SQL, wklejamy powyższy kod, klikamy "wykonaj"
	--tworzy się baza danych z odpowiednimi kolumnami