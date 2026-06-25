<script setup>
const banner = {
  title: 'Products',
  subtitle:
    'Curated lighting, interiors, care, tools and accessories selected for cleaner upgrades.',
  image: '/image/product-page/led-lighting-hero.png',
}
</script>

<template>
  <section class="bg-black pt-[74px] text-white">
    <div
      class="relative h-[260px] overflow-hidden border-y border-white/10 bg-[#050607]"
    >
      <img
        :src="banner.image"
        :alt="banner.title"
        class="absolute inset-0 h-full w-full object-cover object-center"
      />

      <div
        class="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.94)_0%,rgba(0,0,0,.68)_30%,rgba(0,0,0,.18)_60%,rgba(0,0,0,.62)_100%)]"
      ></div>

      <div
        class="relative mx-auto flex h-full max-w-[1500px] items-center px-5 sm:px-8 lg:px-12"
      >
        <div class="max-w-md">
          <div
            class="mb-5 h-1 w-9 bg-[#E50914] shadow-[0_0_18px_rgba(229,9,20,.7)]"
          ></div>

          <h1
            class="text-[clamp(2.5rem,4vw,4.2rem)] font-light uppercase tracking-[0.05em]"
          >
            {{ banner.title }}
          </h1>

          <p class="mt-4 text-base leading-7 text-white/60">
            {{ banner.subtitle }}
          </p>
        </div>
      </div>

      <div
        class="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
      ></div>
    </div>
  </section>
</template>