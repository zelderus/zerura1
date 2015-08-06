class ArticlesController < ApplicationController


  http_basic_authenticate_with name: "zelder", password: "pass", except: [:index, :show]
  
  

	def index
		set_title(t('articles_headers_title'))
		set_headers(t('articles_headers_keyword'), t('articles_headers_desc'))

		@articles = Article.all()
	end
	
	
	def show
		@article = Article.find(params[:id])

		set_title(@article.title)
		set_headers(@article.title, @article.title)

	end
	
	

	def new
		@article = Article.new
	end
	
	
	
	def edit
	  @article = Article.find(params[:id])
	end
	
	
	
	
	def create
		@article = Article.new(article_params)
		
		if @article.save()
			redirect_to @article
		else
			render 'new'
		end
		
	end
	
	
	
	def update
	  @article = Article.find(params[:id])
	  
	  if (@article.update(article_params))
	    redirect_to @article
	  else
	    render 'edit'
	  end
	end
	
	
private
	def article_params
		params.require(:article).permit(:title, :text)
	end
	
end
