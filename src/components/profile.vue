<template>
    <div class="container-fluid mt-2">
        <div class="row">
            <div class="col-4 col-md-4 col-lg-4 col-xl-2">
                <b-card>
                    <b-card-body><h4>{{me.username}}</h4><p> Here you can view details about your profile and change your currency.</p></b-card-body>
                </b-card>
            </div>
            <div class="col-4 col-md-4 col-lg-4 col-xl-3">
                <b-card>
                    <b-card-title>
                        <h6>Change Your Currency</h6>
                    </b-card-title>
                    <b-card-body>
                        <multiselect @input="updateme" :allowEmpty="false" v-model="me.currency" :options="currencies" placeholder="Change Your Currency"></multiselect>
                    </b-card-body>
                </b-card>
            </div>
            <div class="col-4 col-md-4 col-lg-4 col-xl-3">
                <b-card>
                    <b-card-title>
                        <h6>Change Your Theme</h6>
                    </b-card-title>
                     <b-card-body>
                        <multiselect @input="updateme" :allowEmpty="false" v-model="me.theme" :options="theme.themes" placeholder="Change Your Theme"></multiselect>
                    </b-card-body>
                </b-card>
            </div>
         </div>
    </div>
</template>

<script>
import Multiselect from "vue-multiselect";
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
        ...mapState(["me","theme"])
    },
    methods: {
        ...mapActions(["getYears"]),
        async updateme(){
            const update = await user.updateme(this.me);
            user.store(update.data);
            this.getYears();
        }
    }
}
</script>