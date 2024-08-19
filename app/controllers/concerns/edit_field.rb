module EditField
  extend ActiveSupport::Concern

  included do
    before_action :set_edit_field_resource
  end

  def edit_field
    # @edit_field_resource = instance_variable_get("@#{resource_name}")
    @field = params[:field]

    render 'shared/edit_field'
  end



  private

  def set_edit_field_resource
    return if params[:id].blank?

    model_name = controller_name.singularize.capitalize.constantize
    @edit_field_resource = model_name.find(params[:id])
  end

  def resource_name
    controller_name.singularize
  end
end
