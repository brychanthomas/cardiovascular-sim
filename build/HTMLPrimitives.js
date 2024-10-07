/**
 * Static class with functions to create and insert groups of DOM elements
 */
export class HTMLPrimitives {
    /**
     * Create span element and add it to DOM
     * @param parent element to add span to
     * @param text text to display in span
     * @param (optional) noBr true to not prepend a newline (default is to add one)
     * @returns the HTMLSpanElement created
     */
    static span(parent, text, noBr) {
        if (!noBr) {
            parent.appendChild(document.createElement('br'));
        }
        var span = document.createElement("span");
        span.textContent = text;
        parent.appendChild(span);
        return span;
    }
    /**
     * Create group box (div with white border and title) and add to DOM
     * @param parent element to insert box into
     * @param title
     * @returns the HTMLDivElement created
     */
    static groupBox(parent, title) {
        var div = document.createElement("div");
        div.classList.add("groupingBox");
        parent.appendChild(div);
        var titleSpan = HTMLPrimitives.span(div, title, true);
        titleSpan.classList.add("groupingBoxTitle");
        return div;
    }
    /**
     * Create hover box (only appears when mouse over span) and add to DOM
     * @param parent element to insert hover box into
     * @param hoverText HTMLSpanElement to trigger display of box on mouseover
     * @param colour background colour of hover box
     * @returns the HTMLDivElement created
     */
    static hoverBox(parent, hoverText, colour) {
        var box = document.createElement("div");
        box.classList.add("hoverBox");
        box.style.backgroundColor = colour;
        hoverText.onmousemove = function (e) {
            box.style.display = "block";
            box.style.left = e.clientX + 'px';
            box.style.top = e.clientY + 5 + 'px';
        };
        hoverText.onmouseleave = function () {
            box.style.display = "none";
        };
        parent.appendChild(box);
        return box;
    }
    /**
     * Create slider with label plus value next to it and add to DOM
     * @param parent element to insert slider into
     * @param label text to label slider with
     * @param maxValue maximum value of the slider
     * @param unit unit of slider value
     * @returns the HTMLInputElement created
     */
    static slider(parent, label, maxValue, unit) {
        HTMLPrimitives.span(parent, label, true);
        let slider = document.createElement("input");
        slider.setAttribute("max", String(maxValue));
        slider.setAttribute("min", "0");
        slider.setAttribute("type", "range");
        slider.setAttribute("value", "0");
        slider.setAttribute("step", String(maxValue / 100));
        parent.appendChild(slider);
        var sliderLabel = HTMLPrimitives.span(parent, '0' + unit, true);
        slider.addEventListener("input", function () {
            sliderLabel.textContent = slider.value + unit;
        });
        return slider;
    }
}
