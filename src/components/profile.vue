<template>
    <div class="container-fluid mt-2">
        <div class="row">
            <div class="col-6 col-sm-6 col-md-6 col-lg-2">
                <b-card style="background-color: transparent;">
                    <b-card-body><strong>{{me.username}}</strong><p> Here you can view details about your profile and change your currency.</p></b-card-body>
                </b-card>
            </div>
            <div class="col-6 col-sm-6 col-md-6 col-lg-2">
                <b-card style="background-color: transparent;">
                    <b-card-body>
                        <multiselect @input="updateme" :allowEmpty="false" v-model="me.currency" :options="currencies" placeholder="Change Your Currency"></multiselect>
                    </b-card-body>
                </b-card>
            </div>
         </div>
    </div>
</template>

<script>
import Multiselect from 'vue-multiselect';
import { mapState, mapActions } from "vuex";
import user from "@/services/auth";
export default {
    name: "Profile",
    components: { Multiselect },
    data() {
        return {
            currencies: ["$", "£", "€"]
        }
    },
    computed: {
        ...mapState(["me"])
    },
    methods: {
        ...mapActions(["getYears"]),
        async updateme(){
            const update = await user.updateme(this.me.currency);
            user.store(update.data);
            this.getYears();
        }
    }
}
</script>