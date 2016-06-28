# db-to-git
Dump your database into git

## Project Goal

Make it possible to dump database SQL tables into a consistent file tree format. The file trees should be optimized for tracking in Git such that consequtive dumps of the same data will produce usable diffs.

Schema data is written to YAML files, and optional properties can be added manually to columns' YAML files that control how columns get encoded/decoded to files. This would enable, for example, a text column containing markdown to be named `.md` instead of a default of `.txt`. When updating an existing tree the dump tool will carry these non-sql configuration properties forward.

## Project Status

Idea / thought experiment

## Directory Structure Mockup

For a table named `people`:
```
people.schema/
  username.yml
  first_name.yml
  last_name.yml
  about.yml
  headshot.yml
people.data/
  johndoe29/
    ...
  luke.skywalker/
    first_name.txt
    last_name.txt
    about.md
    headshot.jpg
```


## Prior art

- [dbtoyaml](http://pgxn.org/dist/pyrseas/docs/dbtoyaml.html): dump PostgreSQL schema to YAML

## Questions

- It should be safe to assume or just require that table and column names contain only characters safe for filenames in git. Primary key values will offer no such guarantees though. In target applications, primary keys should be "slug"-like which would work well -- but how can that be enforced as a constraint or something like a `/` coming up in a primary key value be handled?
