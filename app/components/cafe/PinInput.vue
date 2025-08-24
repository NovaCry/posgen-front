<script setup lang="ts">
import { ref } from "vue"
import {
    PinInput,
    PinInputGroup,
    PinInputSlot,
} from "@/components/ui/pin-input"


const value = ref<string[]>([])
const handleComplete = (e: string[]) => alert(e.join(""))
</script>


<template>
    <div>
        <PinInput id="pin-input" v-model="value" placeholder="○" @complete="handleComplete">
            <PinInputGroup class="gap-3">
                <template v-for="(id, index) in 6" :key="id">
                    <PinInputSlot class="rounded-md border" :index="index" />
                </template>
            </PinInputGroup>
        </PinInput>
    </div>
</template>