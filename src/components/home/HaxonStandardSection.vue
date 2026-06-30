<template>
  <section class="relative overflow-hidden bg-black text-white">
    <div class="grid min-h-[420px] lg:grid-cols-[1.1fr_0.9fr]">
      <div class="relative min-h-[360px] overflow-hidden lg:min-h-[520px]">
        <img
          src="/image/products/no-image.jpeg"
          alt="Haxon standard"
          class="absolute inset-0 h-full w-full object-cover opacity-85"
        />

        <div class="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.05)_0%,rgba(0,0,0,0.22)_52%,rgba(0,0,0,1)_100%)]"></div>
      </div>

      <div class="relative flex min-h-[360px] items-center bg-black px-7 py-14 sm:px-10 lg:min-h-[520px] lg:px-20">
        <div class="max-w-xl">
          <h2 class="text-[clamp(2.5rem,4.8vw,5.8rem)] font-light leading-[0.88] tracking-[-0.075em] text-white">
            We don’t follow trends.
            <span class="block">We focus on the details</span>
            <span class="block">that matter.</span>
          </h2>

          <p class="mt-8 max-w-md text-base leading-8 text-white/50">
            Every product is chosen for one reason — to make your drive better.
          </p>

          <router-link
            to="/standard"
            class="group mt-9 inline-flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.28em] text-white transition hover:text-white/75"
          >
            Our Story
            <span class="text-[#E50914] transition group-hover:translate-x-1">›</span>
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>