<?php

try {
   $conn = new PDO ( "sqlsrv:server = tcp:bodmirbot.database.windows.net,1433; Database = Tvbot", "bodmir", "Guitariste23");
       $conn->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );
}
catch ( PDOException $e ) {
   print( "Error connecting to SQL Server." );
      die(print_r($e));
}

$sql = '
SELECT * FROM tvbot.user
';

$db = $conn->query($sql);

while ($donnees = $reponse->fetch())
{
  var_dump($donnees);
}