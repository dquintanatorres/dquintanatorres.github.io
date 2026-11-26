---
layout: genospan
share: false
permalink: /software/genospan/
title: Genospan
excerpt: A Nextflow pipeline for building a versioned database of genomic features and observed maximum lifespan across species.
---

Genospan measures genomic features from reference assemblies and links them to records of observed maximum lifespan. The resulting dataset is designed for comparative analyses that test how well genomic measurements predict lifespan across species and look for features associated with longevity.

## From genomes to a queryable dataset

<figure class="genospan-workflow" aria-label="Genospan workflow">
  <ol role="list">
    <li><strong>Choose species</strong>Use a species list or select an NCBI taxonomic clade.</li>
    <li><strong>Resolve assemblies</strong>Choose one assembly per species, favoring eligible NCBI references.</li>
    <li><strong>Measure features</strong>Profile the assembly sequence and use matching gene annotations for selected structural features.</li>
    <li><strong>Store results</strong>Record features, observed lifespan and provenance in SQLite, with optional regional detail in Parquet.</li>
  </ol>
</figure>

Sequence measurements include nucleotide composition, short sequence patterns, and simple repeats. Optional annotation-based features summarize properties such as exon and intron lengths. Lifespan records come from AnAge or a documented supplemental source. Species can contribute genomic features even when their lifespan is unavailable. [Browse the feature groups]({{ '/software/genospan/features/' | relative_url }}).

## Explore the pilot

The pilot covers four species, with lifespan records for three. It shows how to trace a measurement to its assembly and how to query features alongside their lifespan labels. [See the pilot data and SQL example]({{ '/software/genospan/database/' | relative_url }}).
