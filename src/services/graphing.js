import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated.js";
import am4themes_dark from "@amcharts/amcharts4/themes/dark.js"

export default {
    pie(id, data, title, vm) {
        am4core.useTheme(am4themes_animated);
        am4core.useTheme(am4themes_dark);
        let chart = am4core.create(id, am4charts.PieChart);
        chart.data = data;
        let chartTitle = chart.titles.create();
        chartTitle.text = title;
        chartTitle.fontSize = 20;
        chartTitle.cursorOverStyle = am4core.MouseCursorStyle.pointer;
        chartTitle.tooltipText = "Back"
        chartTitle.events.on("hit", () => {
            vm.draw();
        }, vm)
        let pieSeries = chart.series.push(new am4charts.PieSeries());
        pieSeries.dataFields.value = "amount";
        pieSeries.dataFields.category = "description";
        pieSeries.slices.template.fillOpacity = 0.2;
        pieSeries.slices.template.strokeWidth = 1;
        pieSeries.slices.template.strokeOpacity = 1;
        pieSeries.labels.template.text = "";
        pieSeries.slices.template
            .cursorOverStyle = [
                {
                    "property": "cursor",
                    "value": "pointer"
                }
            ];
        pieSeries.hiddenState.properties.opacity = 0.2;
        pieSeries.hiddenState.properties.endAngle = -90;
        pieSeries.hiddenState.properties.startAngle = -90;
    }
}