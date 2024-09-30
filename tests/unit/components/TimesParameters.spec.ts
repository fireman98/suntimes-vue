import { mount } from "@vue/test-utils";
import TimesParameters from "@/components/TimesParameters.vue";
import { DateTime } from "luxon";
import { SuntimesViewType } from "@/interfaces/Suntimes";

describe("TimesParameters component", () => {
  it("renders date inputs", () => {
    const from = DateTime.now();
    const viewType = SuntimesViewType.SUN;

    const component = mount(TimesParameters, {
      props: {
        from: from,
        viewType: viewType,
      },
    });

    expect(component.get("[type=date]")).toBeDefined();
    expect(component.get("[title=previous]")).toBeDefined();
    expect(component.get("[title=next]")).toBeDefined();
  });

  it("changes to previous date via button", () => {
    const from = DateTime.now();
    const viewType = SuntimesViewType.SUN;

    const updateFrom = jest.fn();
    const component = mount(TimesParameters, {
      props: {
        from: from,
        viewType: viewType,
        "onUpdate:from": updateFrom,
      },
    });

    const previousButton = component.get("[title=previous]");
    previousButton.trigger("click");

    expect(updateFrom).toHaveBeenCalledWith(
      from.plus({ month: -1 }).startOf("month")
    );
  });

  it("changes to next date via button", () => {
    const from = DateTime.now();
    const viewType = SuntimesViewType.SUN;

    const updateFrom = jest.fn();
    const component = mount(TimesParameters, {
      props: {
        from: from,
        viewType: viewType,
        "onUpdate:from": updateFrom,
      },
    });

    const nextButton = component.get("[title=next]");
    nextButton.trigger("click");

    expect(updateFrom).toHaveBeenCalledWith(
      from.plus({ month: 1 }).startOf("month")
    );
  });

  it("renders SuntimesViewType values", () => {
    const suntimesViewTypes = Object.values(SuntimesViewType);

    const from = DateTime.now();
    const viewType = SuntimesViewType.SUN;
    const component = mount(TimesParameters, {
      props: {
        from: from,
        viewType: viewType,
      },
    });

    const values = component.findAll("option");
    expect(values).toHaveLength(suntimesViewTypes.length);
  });
});
