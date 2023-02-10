# FogFighters
Repozytorium z projektem zaliczeniowym na Języki programowania i algorytmy - gra Fog Fighters

Description of the game:
Fog Fighters is a online 2-player game, which requires strategy and analitical thinking. Concept of the game is based of the game of battleships. Both players have 4 by 4 boards, on which they arrange their units. These units are: Warrior, Rogue and Archer (each described below). Players do not see each other's boards. After both players located their units on the boards, they each take turns in which they try to hit and eliminate oponent's units. To do so, they must first choose a unit to attack with, and then choose suitable squares on oponent's board. Each unit has unique pattern of attack, and damage they deal to hostile units. Player is informed about successful hits, however he will not be informed which unit or units he attacked or how much damage he delt. Unit that was hit will loose health points equal to the number of damage points attacker delt to that square. When unit's life will be lower or equal to 0, the unit is eliminated and the player is informed that a lethal strike is delivered. After a unit is eliminated from the game, it can no longer be used to attack oponent's board. The first player to eliminate all of oponent's units wins.

Unit description:

-------Warrior--------

![warrior1](https://user-images.githubusercontent.com/83396630/218150262-ad09768a-f846-411c-9331-2f6bf68eef90.png)

-Can be located in the first row of your board 

-Health points: 40

-Attack pattern: attacks two adjacent squares, deals 8 damage points to each (might be patched later)

<br>
<br>

-------Rogue--------

![rogue1](https://user-images.githubusercontent.com/83396630/218150269-287db46a-413c-4570-aba3-5d42de0f52d3.png)

-Can be located in the second or third row of your board

-Health points: 10

-Attack pattern: attacks two oblique squares, deals 20 damage points to each

<br>
<br>

-------Archer--------

![archer1](https://user-images.githubusercontent.com/83396630/218150268-c4867ee9-a653-4133-8d35-3e665913e821.png)

-Can be located in the fourth row of your board

-Health points: 24

-Attack pattern: shoots an arrow into a selected column, and deals 12 damage only to the first unit it hits. If there is more than one enemy unit in the column, the priority of the hit will be Warrior-Rogue-Archer (hight to low).
