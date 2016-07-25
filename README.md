# db-to-git
Dump your database into git

## Project Goal

Make it possible to dump database SQL tables into a consistent file tree format. The file trees should be optimized for tracking in Git such that consequtive dumps of the same data will produce usable diffs.

Schema data is written to YAML files, and optional properties can be added manually to columns' YAML files that control how columns get encoded/decoded to files. This would enable, for example, a text column containing markdown to be named `.md` instead of a default of `.txt`. When updating an existing tree the dump tool will carry these non-sql configuration properties forward.

## Project Status

Idea / thought experiment. This repository is mostly just for questions / examples / research at this point.

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

## Implementation thoughts

This should probably be a Node.js CLI tool that uses the [js-git](https://github.com/creationix/js-git) library to construct git trees in memory without needing to invoke the git cli thousands of times.

## Related efforts & prior art

- [dangit](https://github.com/chriswhong/dangit/): DAta Nudged into GIT - File-based datasets that use git for version control of individual records
- [dbtoyaml](http://pgxn.org/dist/pyrseas/docs/dbtoyaml.html): dump PostgreSQL schema to YAML

## Questions

[See GitHub Issues](https://github.com/themightychris/db-to-git/issues)
