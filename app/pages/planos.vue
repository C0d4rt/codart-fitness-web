<script setup lang="ts">
import { brand } from '~/brand'

const catalog = await usePlans()

useSeoMeta({
  title: 'Planos',
  description: `O Premium e o Básico do ${brand.name}, com preços e o que cada um inclui. ${catalog.trialDays} dias grátis com tudo do Premium.`,
})
</script>

<template>
  <div class="page">
    <SiteNav />
    <header class="intro">
      <h1 class="title">Planos</h1>
      <p class="lead">
        Comece com {{ catalog.trialDays }} dias grátis com tudo do Premium, sem cartão. Depois,
        escolha o plano na própria conversa
      </p>
    </header>

    <PlanCards :catalog="catalog" bare />

    <section class="compare" aria-labelledby="compare-title">
      <div class="compare-head">
        <h2 id="compare-title" class="compare-title">O que cada plano inclui</h2>
        <NuxtLink to="/recursos" class="link">Ver cada recurso com um exemplo</NuxtLink>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th scope="col"><span class="visually-hidden">Recurso</span></th>
            <th scope="col">{{ catalog.basic.name }}</th>
            <th scope="col">{{ catalog.premium.name }}</th>
          </tr>
        </thead>
        <tbody v-for="group in catalog.groups" :key="group.id">
          <tr class="group-row">
            <th scope="colgroup" colspan="3">{{ group.name }}</th>
          </tr>
          <tr v-for="feature in group.features" :key="feature.id">
            <th scope="row">
              <NuxtLink :to="`/recursos#${feature.id}`">{{ feature.name }}</NuxtLink>
            </th>
            <td>{{ feature.plan === 'basic' ? 'Incluso' : '—' }}</td>
            <td>Incluso</td>
          </tr>
        </tbody>
      </table>
    </section>

    <SiteFooter />
  </div>
</template>

<style scoped>
.intro {
  display: grid;
  gap: 1.25rem;
  padding: 4rem var(--margin) 0;
}

.title {
  font-size: var(--step-display);
}

.lead {
  max-width: 44ch;
  color: var(--muted);
  font-size: var(--step-lead);
  line-height: 1.4;
}

.compare {
  display: grid;
  gap: 1.5rem;
  margin: 5rem var(--margin) 0;
  padding: 2rem;
  border-radius: var(--radius);
  background: var(--card);
}

.compare-head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
}

.compare-title {
  font-size: var(--step-lead);
}

.link {
  color: var(--green);
  font-weight: 500;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--step-small);
}

.table th,
.table td {
  padding: 0.75rem 0.5rem;
  border-bottom: 1px solid var(--tone);
  text-align: left;
}

.table td {
  width: 7.5rem;
}

.table thead th {
  font-weight: 700;
}

.table tbody th {
  font-weight: 500;
}

.table tbody th a {
  text-decoration: none;
}

@media (hover: hover) and (pointer: fine) {
  .table tbody th a:hover {
    text-decoration: underline;
  }
}

.group-row th {
  padding-top: 1.5rem;
  color: var(--green);
  font-weight: 700;
}

@media (max-width: 47.99rem) {
  .compare {
    padding: 1.25rem;
  }
  .table td {
    width: 5rem;
  }
}
</style>
