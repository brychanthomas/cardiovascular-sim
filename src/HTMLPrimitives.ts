export class HTMLPrimitives {

    static span(parent: HTMLElement, text: string, noBr?: boolean) {
        if (!noBr) {
            parent.appendChild(document.createElement('br'));
        }
        var span = document.createElement("span");
        span.textContent = text;
        parent.appendChild(span);
        return span;
    }

    static groupBox(parent: HTMLElement, title: string) {
        var div = document.createElement("div");
        div.classList.add("groupingBox");
        parent.appendChild(div);
        var titleSpan = HTMLPrimitives.span(div, title, true);
        titleSpan.classList.add("groupingBoxTitle");
        return div;
    }

    static hoverBox(parent: HTMLElement, hoverText: HTMLSpanElement, colour: string) {
        var box = document.createElement("div");
        box.classList.add("hoverBox");
        box.style.backgroundColor = colour;
        hoverText.onmousemove = function (e) {
            box.style.display = "block";
            box.style.left = e.clientX + 'px';
            box.style.top = e.clientY + 5 + 'px';
        }
        hoverText.onmouseleave = function() {
            box.style.display = "none";
        }
        parent.appendChild(box);
        return box;
    }

    static slider(parent: HTMLElement, label: string, maxValue: number, unit: string) {
        HTMLPrimitives.span(parent, label, true);
        let slider = document.createElement("input");
        slider.setAttribute("max", String(maxValue));
        slider.setAttribute("min", "0");
        slider.setAttribute("type", "range");
        slider.setAttribute("value", "0");
        slider.setAttribute("step", String(maxValue/100));
        parent.appendChild(slider);
        var sliderLabel = HTMLPrimitives.span(parent, '0'+unit, true);
        slider.addEventListener("input", function() {
            sliderLabel.textContent = slider.value + unit;
        });
        return slider;
    }

}