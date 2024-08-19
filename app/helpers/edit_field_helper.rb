module EditFieldHelper
  def edit_field_link(object, field, options = {}, html_options = {}, &block)
    default_html_options = { class: 'inline-edit', data: { turbo_method: :get } }
    html_options = default_html_options.deep_merge(html_options)

    url = [:edit_field, object, { field: }]

    turbo_frame_tag dom_id(object, field) do
      if block_given?
        link_to(url, html_options, &block)
      else
        link_to(object.send(field), url, options.merge(html_options))
      end
    end
  end
end