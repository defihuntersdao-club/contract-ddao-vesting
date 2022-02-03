#!/usr/bin/php
<?php
// This Script Create Contract For Compile To Ropsten

$f = "CrowdsaleVesting.sol";
$f_out = "CrowdsaleVestingTestnet.sol";;
$a = file_get_contents($f);

// DDAO
$from 	= "0x90F3edc7D5298918F7BB51694134b07356F7d0C7";
$to	= "0xF870b9C48C2B9757696c25988426e2A0941334B5";
$a = str_replace($from,$to,$a);

// aDDAO
$from 	= "0xCA1931C970CA8C225A3401Bb472b52C46bBa8382";
$to	= "0xB39f2AC6C5a9846d13B1644cae6d7AeF820eB0B3";
$a = str_replace($from,$to,$a);

// time from 2022-03-01 to another
$from 	= "1646092800";
$to	= 1646092800-86400*30*5;
$a = str_replace($from,$to,$a);

$from 	= "contract CrowdsaleVesting";
$to	= "contract DDAOCrowdsaleVestingTestnet";
$a = str_replace($from,$to,$a);

file_put_contents($f_out,$a);