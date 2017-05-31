#!/usr/bin/php
<?php

/**
 * TODO:
 * - [ ] Read tree file for table into array indexed by name
 * - [ ] Insert new items into array sorted on key
 * - [ ] Write new tree object to git directly
 */


// parse args
if (count($argv) != 4 || !($repoPath = $argv[1]) || !($tableName = $argv[2]) || !($primaryKey = $argv[3])) {
    die('usage: csv-to-git repoPath tableName primaryKey');
}

// initialize if needed
if (!is_dir("$repoPath/.git")) {
    printf("Initializing git repo: %s\n", $repoPath);
    `git init $repoPath`;
}

// build git env
$repoPath = realpath($repoPath);
putenv('GIT_DIR='.$repoPath.'/.git');
putenv('GIT_WORK_TREE='.$repoPath);

// check that work tree is clean
if (`git status --porcelain`) {
    die('git repo is dirty, commit or clean changes first');
}

// write table
printf("Writing table %s with key %s\n", $tableName, $primaryKey);

$tablePath = "$repoPath/$tableName";
if (!is_dir($tablePath)) {
    mkdir($tablePath);
}

$stdin = fopen('php://stdin', 'r');

$lineNumber = 0;
$headers = [];

while (($row = fgetcsv($stdin)) !== false) {
    $lineNumber++;

    // skip header line
    if ($lineNumber == 1) {
        $headers = $row;
        continue;
    }

    $record = array_combine($headers, $row);

    $rowPath = "$tablePath/{$record[$primaryKey]}";
    if (!is_dir($rowPath)) {
        mkdir($rowPath);
    }

    // printf("Read line #%05u: %s\n", $lineNumber, json_encode($record));
    //file_put_contents("./rental_licenses/$record[LICENSENUMBER]", json_encode($record, JSON_PRETTY_PRINT));
    foreach ($record AS $key => $value) {
        file_put_contents("$rowPath/$key", $value);
    }
}

fclose($stdin);

printf("Wrote %u lines\n", $lineNumber);

printf("Staging changes...\n");
`git add --all`;

printf("Committing changes...\n");
`git commit -m "Update $tableName"`;

printf("Done\n");