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
if ($tableIsNew = !is_dir($tablePath)) {
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
    ksort($record);

    $yaml = '';
    foreach ($record AS $key => $value) {
        $yaml .= "$key: $value\n";
    }

    file_put_contents("$tablePath/{$record[$primaryKey]}", $yaml);
}

fclose($stdin);

printf("Wrote %u lines\n", $lineNumber);

printf("Staging changes...\n");
`git add --all`;

printf("Committing changes...\n");
$commitMessage = sprintf("%s %s", $tableIsNew ? 'Create' : 'Update', $tableName);
`git commit -m "$commitMessage"`;

printf("Done\n");