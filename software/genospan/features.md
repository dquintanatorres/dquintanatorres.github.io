---
layout: genospan
share: false
permalink: /software/genospan/features/
title: Genospan feature reference
excerpt: Feature groups, input requirements, and missing-result statuses in Genospan.
---

## Choose features

Pass a comma-separated list of feature IDs or groups to `--features`. A group selects every descendant, including any regional or occurrence outputs. This example requests one sequence summary and the entire gene architecture group.

~~~text
--features sequence.cpg.windows.p95,structure.gene_architecture
~~~

By default Genospan measures primary nuclear sequence summaries, including unplaced nuclear sequence in whole-assembly statistics. Mitochondrial and annotation-derived features are opt-in, as are regional and occurrence outputs. Selecting the top-level `sequence` group includes mitochondrial and detailed sequence outputs.

## Feature groups

### Sequence

These features use the FASTA sequence and NCBI sequence report.

- `sequence.assembly` and `sequence.chromosomes` report assembly span, FASTA record count and contiguity, ambiguous bases, and the fraction located on assembled chromosomes.
- `sequence.composition`, `sequence.cpg`, and `sequence.complexity.windows` measure GC fraction, CpG frequency and enrichment, and distributions of GC, CpG, and nucleotide entropy across full 10 kb windows with at least 80% called bases. `sequence.cpg.windows.regions` records coordinates and counts for eligible windows.
- `sequence.kmers` reports frequencies and entropy for reverse-complement classes of k-mers from length one through six.
- `sequence.repeats` summarizes homopolymers and tandem repeats. Tandem repeats have periods from two through six bases and at least three copies. `sequence.repeats.tandem.occurrences` records their coordinates.
- `sequence.mitochondrial` reports span, GC fraction, and CpG fraction for mitochondrial sequence.

### Gene annotation

These measurements also require a GFF3 for the selected assembly version. A structural annotation identifies the genomic coordinates of features such as genes, transcripts, exons, and coding sequences.

- `structure.gene_architecture` reports median exon and intron lengths, the fraction of the assembly overlapped by annotated genes, and optional exon and intron intervals. Introns are inferred from consecutive exons of the same transcript.
- `structure.cds` measures GC fraction across the union of coding intervals.
- `structure.promoters` measures CpG fraction in full 2 kb windows upstream of annotated mRNA starts.

## Interpret results

Each result has a status. `measured` indicates an available result. The workflow also records `annotation_unavailable` for missing GFF3, `sequence_scope_unavailable` for missing sequence such as mitochondria, `insufficient_eligible_windows`, and `no_eligible_observations`. Use the status to distinguish a missing result from a numeric zero. For scalar measurements, the denominator and coverage are available where defined. Regional and occurrence outputs use zero-based, half-open coordinates.

For the complete list and exact definitions, query the catalog included in your checkout. It shows each feature ID, output type, default status, and required inputs.

~~~sh
uv run --locked nextflow run main.nf --list-features
~~~
