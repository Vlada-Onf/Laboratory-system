using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Cascade : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "actions",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "varchar(255)", nullable: false),
                    description = table.Column<string>(type: "varchar(2000)", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "timezone('utc', now())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_actions", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "categories",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "varchar(255)", nullable: false),
                    description = table.Column<string>(type: "text", nullable: true),
                    photo_url = table.Column<string>(type: "text", nullable: true),
                    card_color = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "timezone('utc', now())"),
                    last_updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    last_updated_by = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_categories", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "damaged_component_reasons",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "varchar(255)", nullable: false),
                    description = table.Column<string>(type: "varchar(2000)", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "timezone('utc', now())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_damaged_component_reasons", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "dashboard_statistics",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    statistic_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    total_components_count = table.Column<int>(type: "integer", nullable: false),
                    total_components_cost = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    total_decommissioned_count = table.Column<int>(type: "integer", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "timezone('utc', now())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_dashboard_statistics", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "entity_types",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "varchar(255)", nullable: false),
                    description = table.Column<string>(type: "varchar(2000)", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "timezone('utc', now())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_entity_types", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "need_importances",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "varchar(255)", nullable: false),
                    level = table.Column<int>(type: "integer", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "timezone('utc', now())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_need_importances", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "need_statuses",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "varchar(255)", nullable: false),
                    description = table.Column<string>(type: "varchar(1000)", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "timezone('utc', now())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_need_statuses", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "roles",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "varchar(100)", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "timezone('utc', now())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_roles", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "tags",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "varchar(100)", nullable: false),
                    color = table.Column<string>(type: "varchar(7)", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "timezone('utc', now())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_tags", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "wishlist_importances",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "varchar(255)", nullable: false),
                    level = table.Column<int>(type: "integer", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "timezone('utc', now())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_wishlist_importances", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "wishlist_statuses",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "varchar(255)", nullable: false),
                    description = table.Column<string>(type: "varchar(1000)", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "timezone('utc', now())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_wishlist_statuses", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "components",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    category_id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "varchar(255)", nullable: false),
                    description = table.Column<string>(type: "varchar(2000)", nullable: true),
                    quantity = table.Column<int>(type: "integer", nullable: false),
                    price = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    total_cost = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    photo_url = table.Column<string>(type: "varchar(500)", nullable: false),
                    supplier_link = table.Column<string>(type: "varchar(500)", nullable: false),
                    documentation_link = table.Column<string>(type: "varchar(500)", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "timezone('utc', now())"),
                    created_by = table.Column<Guid>(type: "uuid", nullable: false),
                    last_updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    last_updated_by = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_components", x => x.id);
                    table.ForeignKey(
                        name: "fk_components_categories_id",
                        column: x => x.category_id,
                        principalTable: "categories",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "history",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    action_id = table.Column<Guid>(type: "uuid", nullable: false),
                    entity_type_id = table.Column<Guid>(type: "uuid", nullable: false),
                    entity_id = table.Column<string>(type: "varchar(100)", nullable: false),
                    old_values = table.Column<string>(type: "jsonb", nullable: true),
                    new_values = table.Column<string>(type: "jsonb", nullable: true),
                    time = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "timezone('utc', now())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_history", x => x.id);
                    table.ForeignKey(
                        name: "fk_history_actions_id",
                        column: x => x.action_id,
                        principalTable: "actions",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_history_entity_types_id",
                        column: x => x.entity_type_id,
                        principalTable: "entity_types",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "users",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    clerk_id = table.Column<string>(type: "varchar(255)", nullable: false),
                    email = table.Column<string>(type: "varchar(255)", nullable: false),
                    first_name = table.Column<string>(type: "varchar(100)", nullable: false),
                    last_name = table.Column<string>(type: "varchar(100)", nullable: false),
                    role_id = table.Column<Guid>(type: "uuid", nullable: false),
                    is_active = table.Column<bool>(type: "boolean", nullable: false),
                    photo_url = table.Column<string>(type: "varchar(500)", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "timezone('utc', now())"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    last_activity_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_users", x => x.id);
                    table.ForeignKey(
                        name: "fk_users_roles_id",
                        column: x => x.role_id,
                        principalTable: "roles",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "component_comments",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    component_id = table.Column<Guid>(type: "uuid", nullable: false),
                    content = table.Column<string>(type: "varchar(2000)", nullable: false),
                    created_by = table.Column<Guid>(type: "uuid", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "timezone('utc', now())"),
                    last_updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_component_comments", x => x.id);
                    table.ForeignKey(
                        name: "fk_component_comments_components_id",
                        column: x => x.component_id,
                        principalTable: "components",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "component_tags",
                columns: table => new
                {
                    component_id = table.Column<Guid>(type: "uuid", nullable: false),
                    tag_id = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_component_tags", x => new { x.component_id, x.tag_id });
                    table.ForeignKey(
                        name: "fk_component_tags_components_id",
                        column: x => x.component_id,
                        principalTable: "components",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_component_tags_tags_id",
                        column: x => x.tag_id,
                        principalTable: "tags",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "component_useful_links",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    component_id = table.Column<Guid>(type: "uuid", nullable: false),
                    title = table.Column<string>(type: "varchar(255)", nullable: false),
                    url = table.Column<string>(type: "varchar(500)", nullable: false),
                    created_by = table.Column<Guid>(type: "uuid", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "timezone('utc', now())"),
                    last_updated_by = table.Column<Guid>(type: "uuid", nullable: true),
                    last_updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_component_useful_links", x => x.id);
                    table.ForeignKey(
                        name: "fk_component_useful_links_components_id",
                        column: x => x.component_id,
                        principalTable: "components",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "damaged_components",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    component_id = table.Column<Guid>(type: "uuid", nullable: false),
                    reason_id = table.Column<Guid>(type: "uuid", nullable: false),
                    quantity = table.Column<int>(type: "integer", nullable: false),
                    recorded_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "timezone('utc', now())"),
                    recorded_by = table.Column<Guid>(type: "uuid", nullable: false),
                    last_updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    last_updated_by = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_damaged_components", x => x.id);
                    table.ForeignKey(
                        name: "fk_damaged_components_components_id",
                        column: x => x.component_id,
                        principalTable: "components",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_damaged_components_reasons_id",
                        column: x => x.reason_id,
                        principalTable: "damaged_component_reasons",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "needs",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    component_id = table.Column<Guid>(type: "uuid", nullable: false),
                    quantity_needed = table.Column<int>(type: "integer", nullable: false),
                    requested_by = table.Column<Guid>(type: "uuid", nullable: false),
                    requested_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "timezone('utc', now())"),
                    description = table.Column<string>(type: "varchar(1000)", nullable: true),
                    completed_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    completion_reason = table.Column<string>(type: "varchar(1000)", nullable: true),
                    importance_id = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_needs", x => x.id);
                    table.ForeignKey(
                        name: "fk_needs_components_id",
                        column: x => x.component_id,
                        principalTable: "components",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_needs_importance_id",
                        column: x => x.importance_id,
                        principalTable: "need_importances",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "schematics",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    component_id = table.Column<Guid>(type: "uuid", nullable: false),
                    title = table.Column<string>(type: "varchar(255)", nullable: false),
                    description = table.Column<string>(type: "varchar(2000)", nullable: true),
                    photo_url = table.Column<string>(type: "varchar(500)", nullable: true),
                    additional_links = table.Column<string>(type: "varchar(2000)", nullable: true),
                    created_by = table.Column<Guid>(type: "uuid", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "timezone('utc', now())"),
                    updated_by = table.Column<Guid>(type: "uuid", nullable: true),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_schematics", x => x.id);
                    table.ForeignKey(
                        name: "fk_schematics_components_id",
                        column: x => x.component_id,
                        principalTable: "components",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "wishlists",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    component_id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "varchar(255)", nullable: false),
                    description = table.Column<string>(type: "varchar(1000)", nullable: true),
                    quantity_needed = table.Column<int>(type: "integer", nullable: false),
                    requested_by = table.Column<Guid>(type: "uuid", nullable: false),
                    requested_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "timezone('utc', now())"),
                    importance_id = table.Column<Guid>(type: "uuid", nullable: false),
                    status_id = table.Column<Guid>(type: "uuid", nullable: false),
                    completed_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    completion_reason = table.Column<string>(type: "varchar(1000)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_wishlists", x => x.id);
                    table.ForeignKey(
                        name: "fk_wishlists_components_id",
                        column: x => x.component_id,
                        principalTable: "components",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_wishlists_importances_id",
                        column: x => x.importance_id,
                        principalTable: "wishlist_importances",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_wishlists_statuses_id",
                        column: x => x.status_id,
                        principalTable: "wishlist_statuses",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "ix_actions_name_unique",
                table: "actions",
                column: "name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_categories_name_unique",
                table: "categories",
                column: "name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_component_comments_component_id",
                table: "component_comments",
                column: "component_id");

            migrationBuilder.CreateIndex(
                name: "ix_component_tags_tag_id",
                table: "component_tags",
                column: "tag_id");

            migrationBuilder.CreateIndex(
                name: "ix_component_useful_links_component_id",
                table: "component_useful_links",
                column: "component_id");

            migrationBuilder.CreateIndex(
                name: "ix_components_category_id",
                table: "components",
                column: "category_id");

            migrationBuilder.CreateIndex(
                name: "ix_components_name",
                table: "components",
                column: "name");

            migrationBuilder.CreateIndex(
                name: "ix_damaged_component_reasons_name_unique",
                table: "damaged_component_reasons",
                column: "name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_damaged_components_component_id",
                table: "damaged_components",
                column: "component_id");

            migrationBuilder.CreateIndex(
                name: "ix_damaged_components_reason_id",
                table: "damaged_components",
                column: "reason_id");

            migrationBuilder.CreateIndex(
                name: "ix_dashboard_statistics_statistic_date_unique",
                table: "dashboard_statistics",
                column: "statistic_date",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_dashboard_statistics_updated_at",
                table: "dashboard_statistics",
                column: "updated_at");

            migrationBuilder.CreateIndex(
                name: "ix_entity_types_name_unique",
                table: "entity_types",
                column: "name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_history_action_id",
                table: "history",
                column: "action_id");

            migrationBuilder.CreateIndex(
                name: "ix_history_entity_type_id",
                table: "history",
                column: "entity_type_id");

            migrationBuilder.CreateIndex(
                name: "ix_history_time",
                table: "history",
                column: "time");

            migrationBuilder.CreateIndex(
                name: "ix_history_user_id",
                table: "history",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "ix_need_importances_level",
                table: "need_importances",
                column: "level");

            migrationBuilder.CreateIndex(
                name: "ix_need_importances_name_unique",
                table: "need_importances",
                column: "name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_need_statuses_name_unique",
                table: "need_statuses",
                column: "name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_needs_component_id",
                table: "needs",
                column: "component_id");

            migrationBuilder.CreateIndex(
                name: "ix_needs_importance_id",
                table: "needs",
                column: "importance_id");

            migrationBuilder.CreateIndex(
                name: "ix_needs_requested_by",
                table: "needs",
                column: "requested_by");

            migrationBuilder.CreateIndex(
                name: "ix_roles_name_unique",
                table: "roles",
                column: "name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_schematics_component_id",
                table: "schematics",
                column: "component_id");

            migrationBuilder.CreateIndex(
                name: "ix_tags_name_unique",
                table: "tags",
                column: "name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_users_clerk_id_unique",
                table: "users",
                column: "clerk_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_users_email_unique",
                table: "users",
                column: "email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_users_role_id",
                table: "users",
                column: "role_id");

            migrationBuilder.CreateIndex(
                name: "ix_wishlist_importances_level",
                table: "wishlist_importances",
                column: "level");

            migrationBuilder.CreateIndex(
                name: "ix_wishlist_importances_name_unique",
                table: "wishlist_importances",
                column: "name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_wishlist_statuses_name_unique",
                table: "wishlist_statuses",
                column: "name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_wishlists_component_id",
                table: "wishlists",
                column: "component_id");

            migrationBuilder.CreateIndex(
                name: "ix_wishlists_importance_id",
                table: "wishlists",
                column: "importance_id");

            migrationBuilder.CreateIndex(
                name: "ix_wishlists_requested_by",
                table: "wishlists",
                column: "requested_by");

            migrationBuilder.CreateIndex(
                name: "ix_wishlists_status_id",
                table: "wishlists",
                column: "status_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "component_comments");

            migrationBuilder.DropTable(
                name: "component_tags");

            migrationBuilder.DropTable(
                name: "component_useful_links");

            migrationBuilder.DropTable(
                name: "damaged_components");

            migrationBuilder.DropTable(
                name: "dashboard_statistics");

            migrationBuilder.DropTable(
                name: "history");

            migrationBuilder.DropTable(
                name: "need_statuses");

            migrationBuilder.DropTable(
                name: "needs");

            migrationBuilder.DropTable(
                name: "schematics");

            migrationBuilder.DropTable(
                name: "users");

            migrationBuilder.DropTable(
                name: "wishlists");

            migrationBuilder.DropTable(
                name: "tags");

            migrationBuilder.DropTable(
                name: "damaged_component_reasons");

            migrationBuilder.DropTable(
                name: "actions");

            migrationBuilder.DropTable(
                name: "entity_types");

            migrationBuilder.DropTable(
                name: "need_importances");

            migrationBuilder.DropTable(
                name: "roles");

            migrationBuilder.DropTable(
                name: "components");

            migrationBuilder.DropTable(
                name: "wishlist_importances");

            migrationBuilder.DropTable(
                name: "wishlist_statuses");

            migrationBuilder.DropTable(
                name: "categories");
        }
    }
}
