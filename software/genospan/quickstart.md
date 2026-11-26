---
layout: genospan
share: false
permalink: /software/genospan/quickstart/
title: Genospan quickstart
excerpt: Run a one-species Genospan example and learn how to configure a cohort.
---

## Run one genome

Run these commands from a local checkout of Genospan. The pilot uses Nextflow 25.10 or later, uv, and curl. uv installs the locked Python environment. This example pins the assembly for *Caenorhabditis elegans* and measures its GC fraction.

~~~sh
uv sync --locked
printf '%s\n' 'GCF_000002985.6' > pilot-species.txt
uv run --locked nextflow run main.nf \
  --species pilot-species.txt \
  --features sequence.composition.gc_fraction \
  --db results/genospan.sqlite
~~~

The run writes `results/genospan.sqlite` and stores input provenance in the database and its sibling `genospan.sqlite.files` directory. Keep them together. [See how to query the output]({{ '/software/genospan/database/#query-the-database' | relative_url }}).

## Select a cohort

- `--species species.txt` accepts one scientific name, species TaxID, or versioned assembly accession per line. Names and TaxIDs let Genospan select the assembly. An accession pins it.
- `--taxon 'Caenorhabditis elegans'` or `--taxon 6239` resolves a name or TaxID through NCBI. A higher-level clade selects species within that clade.

Supply one cohort input per run. Use `--features` with comma-separated names to select individual measurements or entire groups. If you omit it, Genospan computes the default primary nuclear sequence summaries. [See the feature selection examples]({{ '/software/genospan/features/' | relative_url }}).

## Update a database

Reuse the same `--db` path to grow a dataset. `--update add`, the default, adds new species in your cohort. `--update refresh` fills missing or stale requested results for existing species. `--update add,refresh` performs both. Ready genomes are committed in batches of 100 by default. Use `--batch-size 1` to commit each genome as it becomes ready.

By default Genospan downloads the current AnAge snapshot. Supply `--anage /path/to/anage.zip` to pin the lifespan input along with the assembly. Use `--lifespan /path/to/lifespan.tsv` to fill label gaps from documented sources. The TSV requires `tax_id`, `max_lifespan_years`, `source`, and `reference`.

## Control caching

Each task downloads and processes its genome in temporary scratch space by default. Use `--input-cache /path/to/cache` to retain downloaded genomes and annotations. Nextflow keeps task outputs in its work directory for `-resume`. To disable Nextflow task caching for a run, pass `-cache false`.
