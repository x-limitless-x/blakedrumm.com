# frozen_string_literal: true

module Jekyll
  # Generates a category index page for every category that appears in
  # site.categories but does not already have a hand-crafted page under
  # /blog/categories/<slug>/.
  class CategoryPageGenerator < Generator
    safe true
    priority :low

    def generate(site)
      existing_permalinks = site.pages.map(&:url).to_set

      site.categories.each_key do |category|
        slug      = Utils.slugify(category)
        permalink = "/blog/categories/#{slug}/"
        next if existing_permalinks.include?(permalink)

        site.pages << CategoryPage.new(site, site.source, category)
      end
    end
  end

  # A single auto-generated category index page.
  class CategoryPage < Page
    def initialize(site, base, category)
      @site = site
      @base = base
      @dir  = File.join("blog", "categories", Utils.slugify(category))
      @name = "index.html"

      process(@name)

      @data = {
        "layout"   => "page",
        "title"    => category,
        "category" => category,
        "sitemap"  => false,
      }

      @content = <<~LIQUID
        <h5> Posts by Category : {{ page.title }} </h5>

        <div class="card">
        {% for post in site.categories[page.category] %}
         <li class="category-posts"><span>{{ post.date | date_to_string }}</span> &nbsp; <a href="{{ post.url }}">{{ post.title }}</a></li>
        {% endfor %}
        </div>
      LIQUID
    end
  end
end
