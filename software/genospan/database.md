---
layout: genospan
share: false
permalink: /software/genospan/database/
title: Genospan database
excerpt: Explore the pilot cohort, SQLite schema, and an example query joining genomic measurements to lifespan records.
---

## Pilot dataset

The pilot includes four species. Three have observed maximum lifespan records from AnAge. *Saccharomyces paradoxus* illustrates how Genospan retains sequence features when matching annotation and a lifespan record are unavailable. GC fractions were computed from unambiguous bases in the primary nuclear sequence and are shown here as percentages.

<div class="genospan-table" role="region" aria-label="Pilot species and measurements" tabindex="0" markdown="1">

| Species | NCBI assembly | GFF3 used | GC (%) | Maximum lifespan (years) |
| --- | --- | --- | ---: | ---: |
| *Caenorhabditis elegans* | [GCF_000002985.6](https://www.ncbi.nlm.nih.gov/datasets/genome/GCF_000002985.6/) | Yes | 35.44 | [0.16](https://genomics.senescence.info/species/entry.php?species=Caenorhabditis_elegans) |
| *Drosophila melanogaster* | [GCF_000001215.4](https://www.ncbi.nlm.nih.gov/datasets/genome/GCF_000001215.4/) | Yes | 42.01 | [0.30](https://genomics.senescence.info/species/entry.php?species=Drosophila_melanogaster) |
| *Saccharomyces cerevisiae* | [GCF_000146045.2](https://www.ncbi.nlm.nih.gov/datasets/genome/GCF_000146045.2/) | Yes | 38.30 | [0.04](https://genomics.senescence.info/species/entry.php?species=Saccharomyces_cerevisiae) |
| *Saccharomyces paradoxus* | [GCA_030035175.1](https://www.ncbi.nlm.nih.gov/datasets/genome/GCA_030035175.1/) | Unavailable | 38.38 | Unavailable |

</div>

The lifespan values above describe documented observations under the conditions recorded by the source. Each value links to its record in [AnAge, part of the Human Ageing Genomic Resources](https://genomics.senescence.info/species/release.html), credited to João Pedro de Magalhães and distributed under [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/) as described in the [HAGR source terms](https://genomics.senescence.info/legal.html).

## Storage and provenance

- `species` and `assemblies` record taxonomic identifiers, current assembly accessions, and NCBI assembly metadata.
- `features` and `lifespan` expose current measurements and labels. `feature_results` and `lifespan_records` preserve their version histories, including input checksums for features and source evidence for lifespan records.
- `runs` and `run_members` record the requested cohort, feature selection, input provenance, and commit progress. `run_features` and `run_lifespan` link a run to its specific measurement and lifespan records.

The SQLite database stores scalar measurements. The sibling `<database>.files` directory stores selected Parquet details and lifespan input snapshots. Artifact paths are relative to the database's parent directory.

## Query the database

Run this query in a SQLite client on the output from Genospan. It keeps each species with a GC fraction result, including species whose lifespan is missing. `gc_fraction` is on a 0–1 scale.

~~~sql
SELECT s.scientific_name,
       f.accession,
       f.value AS gc_fraction,
       f.status AS gc_status,
       l.max_lifespan_years,
       l.source AS lifespan_source
FROM species AS s
JOIN features AS f ON f.species_tax_id = s.tax_id
LEFT JOIN lifespan AS l ON l.species_tax_id = s.tax_id
WHERE f.feature_id = 'sequence.composition.gc_fraction'
ORDER BY s.scientific_name;
~~~
